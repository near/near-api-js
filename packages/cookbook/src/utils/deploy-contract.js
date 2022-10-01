const fs = require('fs');
const { keyStores, connect } = require('near-api-js');
const os = require('os');
const path = require('path');

async function deployContract({ accountId, contractWasm, keyStore, networkId, nodeUrl }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);
    return account.deployContract(contractWasm);
}

module.exports = {
    deployContract,
};

if (require.main === module) {
    (async function () {
        const accountId = 'near-example.testnet';
        const contractWasm = fs.readFileSync(path.join(__dirname, '../../assets/status_message.wasm'));
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const deployment = await deployContract({ accountId, contractWasm, keyStore, networkId, nodeUrl });
        console.log({ deployment });
    }());
}
