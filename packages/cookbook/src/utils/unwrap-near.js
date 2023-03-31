const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { parseNearAmount } = require('@near-js/utils');
const os = require('os');
const path = require('path');

async function unwrapNear({ accountId, keyStore, networkId, nodeUrl, unwrapAmount, wrapContractId }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);
  
    return account.functionCall({
        contractId: wrapContractId,
        methodName: 'near_withdraw', // method to withdraw wNEAR for NEAR
        args: { amount: parseNearAmount(unwrapAmount) },
        attachedDeposit: '1', // attach one yoctoNEAR
    });
}

module.exports = {
    unwrapNear,
};

if (require.main === module) {
    (async function () {
        const networkId = 'mainnet';
        const nodeUrl = 'https://rpc.mainnet.near.org';
        const wrapContractId = 'wrap.near';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        // Unwrap 1 wNEAR to NEAR
        await unwrapNear({ accountId: 'example.near', keyStore, networkId, nodeUrl, unwrapAmount: '1', wrapContractId });
    }());
}
