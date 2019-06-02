const { SignedTransaction } = require('./protos');
const bs58 = require('bs58');

/**
 * Client for communicating with near blockchain. 
 */

class NearClient {
    constructor(signer, nearConnection) {
        this.signer = signer;
        this.nearConnection = nearConnection;
    }

    async viewAccount(accountId) {
        const response = await this.jsonRpcRequest('query', [`account/${accountId}`, '']);
        return this.decodeResponseValue(response.value);
    }

    async submitTransaction(signedTransaction) {
        const buffer = SignedTransaction.encode(signedTransaction).finish();
        const transaction = bs58.encode(buffer);
        const params = [transaction];
        const response = await this.jsonRpcRequest('broadcast_tx_commit', params);
        response.hash = bs58.decode(response.logs[0].hash);
        return response;
    }

    async signAndSubmitTransaction(originator, transaction) {
        const protoClass = transaction.constructor;
        const className = protoClass.name;
        const propertyName = className[0].toLowerCase() + className.replace(/Transaction$/, '').substring(1);

        const buffer = protoClass.encode(transaction).finish();
        const signatureAndPublicKey = await this.signer.signBuffer(
            buffer,
            originator,
        );

        const signedTransaction = SignedTransaction.create({
            [propertyName]: transaction,
            signature: signatureAndPublicKey.signature,
            publicKey: signatureAndPublicKey.publicKey,
        });
        return this.submitTransaction(signedTransaction);
    }

    async callViewFunction(contractAccountId, methodName, args) {
        if (!args) {
            args = {};
        }
        const serializedArgs = bs58.encode(Buffer.from(JSON.stringify(args)));
        try {
            const result = await this.jsonRpcRequest('query', [`call/${contractAccountId}/${methodName}`, serializedArgs]);
            _printLogs(contractAccountId, result.log);
            const json = JSON.parse(bs58.decode(result.value).toString());
            return json;
        } catch(e) {
            _printLogs(contractAccountId, e.log);
            throw e;
        }
    }

    async getTransactionStatus(transactionHash) {
        const encodedHash = bs58.encode(transactionHash);
        return this.jsonRpcRequest('tx', [encodedHash])
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
        return JSON.parse(bs58.decode(value).toString());
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
