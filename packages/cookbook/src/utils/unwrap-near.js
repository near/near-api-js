const { connect, keyStores, utils } = require('near-api-js');
const os = require('os');
const path = require('path');

async function unwrapNear({ accountId, keyStore, networkId, nodeUrl, unwrapAmount, wrapContractId }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);
  
    return account.functionCall({
        contractId: wrapContractId,
        methodName: 'near_withdraw', // method to withdraw wNEAR for NEAR
        args: { amount: utils.format.parseNearAmount(unwrapAmount) },
        attachedDeposit: '1', // attach one yoctoNEAR
    });
}

if (require.main === module) {
    (async function () {
        const networkId = 'mainnet';
        const nodeUrl = 'https://rpc.mainnet.near.org';
        const wrapContractId = 'wrap.near';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        // Unwrap 1 wNEAR to NEAR
        await unwrapNear({ accountId: 'example.near', keyStore, networkId, nodeUrl, unwrapAmount: '1', wrapContractId });
    }());
}
