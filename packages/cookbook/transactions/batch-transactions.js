const { connect, transactions, keyStores } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
// NOTE: replace "example" with your accountId
const CONTRACT_NAME = "contract.example.testnet";
const WHITELIST_ACCOUNT_ID = "whitelisted-account.example.testnet";
const WASM_PATH = path.join(__dirname, "../utils/wasm-files/staking_pool_factory.wasm");

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

sendTransactions();

async function sendTransactions() {
    const near = await connect({ ...config, keyStore });
    const account = await near.account(CONTRACT_NAME);
    const newArgs = { staking_pool_whitelist_account_id: WHITELIST_ACCOUNT_ID };
    const result = await account.signAndSendTransaction({
        receiverId: CONTRACT_NAME,
        actions: [
            transactions.deployContract(fs.readFileSync(WASM_PATH)),
            transactions.functionCall(
                "new",
                Buffer.from(JSON.stringify(newArgs)),
                10000000000000,
                "0"
            ),
        ],
    });

    console.log(result);
}
