const { Account } = require('@near-js/accounts');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const fs = require('fs');
const os = require('os');
const path = require('path');

async function deployContract({ accountId, contractWasm, keyStore, networkId, nodeUrl }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    return account.deployContract(contractWasm);
}

module.exports = {
    deployContract,
};

if (require.main === module) {
    (async function () {
        const accountId = 'near-example.testnet';
        const contractWasm = fs.readFileSync(path.join(__dirname, '../../contracts/status_message.wasm'));
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        const deployment = await deployContract({ accountId, contractWasm, keyStore, networkId, nodeUrl });
        console.log({ deployment });
    }());
}
