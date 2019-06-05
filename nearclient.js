const { SignedTransaction } = require('./protos');
const { getTransactionFieldName } = require('./protos-utils');

/**
 * Client for communicating with near blockchain. 
 */

function _arrayBufferToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
}

function _base64ToBuffer(str) {
    return new Buffer.from(str, 'base64');
}

class NearClient {
    constructor(signer, nearConnection) {
        this.signer = signer;
        this.nearConnection = nearConnection;
    }

    async viewAccount(accountId) {
        const response = await this.jsonRpcRequest('abci_query', [`account/${accountId}`, '', '0', false]);
        return this.decodeResponseValue(response.response.value);
    }

    async submitTransaction(signedTransaction) {
        const buffer = SignedTransaction.encode(signedTransaction).finish();
        const transaction = _arrayBufferToBase64(buffer);
        const params = [transaction];
        const response = await this.jsonRpcRequest('broadcast_tx_commit', params);
        response.hash = Buffer.from(response.hash, 'hex');
        return response;
    }

    async signAndSubmitTransaction(originator, transaction) {
        const fieldName = getTransactionFieldName(transaction);
        if  (!fieldName) {
            throw new Error(`Transaction type ${transaction.constructor.name} isn't recognized by protos-utils`);
        }

        const buffer = transaction.constructor.encode(transaction).finish();
        const signatureAndPublicKey = await this.signer.signBuffer(
            buffer,
            originator,
        );

        const signedTransaction = SignedTransaction.create({
            [fieldName]: transaction,
            signature: signatureAndPublicKey.signature,
            publicKey: signatureAndPublicKey.publicKey,
        });
        return this.submitTransaction(signedTransaction);
    }

    async callViewFunction(contractAccountId, methodName, args) {
        if (!args) {
            args = {};
        }
        const serializedArgs = Buffer.from(JSON.stringify(args)).toString('hex');
        try {
            const result = await this.jsonRpcRequest('abci_query', [`call/${contractAccountId}/${methodName}`, serializedArgs, '0', false]);
            const response = result.response;
            _printLogs(contractAccountId, response.log);
            const json = JSON.parse(_base64ToBuffer(response.value).toString());
            return json;
        } catch(e) {
            _printLogs(contractAccountId, e.log);
            throw e;
        }
    }

    async getTransactionStatus(transactionHash) {
        const encodedHash = _arrayBufferToBase64(transactionHash);
        const response = await this.jsonRpcRequest('tx', [encodedHash, false]);
        // tx_result has default values: code = 0, logs: '', data: ''.
        const codes = { 0: 'Completed', 1: 'Failed', 2: 'Started' };
        const status = codes[response.tx_result.code || 0] || 'Unknown';
        let logs = [];
        if (response.tx_result !== undefined && response.tx_result.log !== undefined && response.tx_result.log.length > 0) {
            logs = response.tx_result.log.split('\n');
        }
        return { logs, status, value: response.tx_result.data };
    }

    async getNonce(accountId) {
        return (await this.viewAccount(accountId)).nonce + 1;
    }

    async jsonRpcRequest(method, params) {
        const request = {
            jsonrpc: '2.0',
            method,
            params,
            id: Date.now().toString(),
        };
        const response = await this.nearConnection.request('', request);
        if (response.error) {
            const { code, message, data } = response.error;
            throw new Error(`[${code}] ${message}: ${data}`);
        }
        if (!response.result) {
            throw new Error('Unexpected response: ' + JSON.stringify(response));
        }
        const result = response.result.response || response.result;
        const { code, info, log } = result;
        if (code) {
            const error = new Error(`[${code}] Error calling ${method}(${params})\nMessage: ${info}\n${log}`);
            error.log = log;
            throw error;
        }
        return response.result;
    }

    async request(methodName, params) {
        return this.nearConnection.request(methodName, params);
    }


    decodeResponseValue(value) {
        return JSON.parse(_base64ToBuffer(value).toString());
    }
}


function _printLogs(contractAccountId, log) {
    let logs = [];
    if (log !== undefined && log.length > 0) {
        logs = log.split('\n');
    }
    logs.forEach(line => {
        console.log(`[${contractAccountId}]: ${line}`);
    });
}

module.exports = NearClient;
