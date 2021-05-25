const { keyStores, connect } = require("near-api-js");

const CREDENTIALS_DIR = ".near-credentials";
const ACCOUNT_ID = "example.testnet";
const PUBLIC_KEY = "8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

deleteAccessKey(ACCOUNT_ID, PUBLIC_KEY);

async function deleteAccessKey(accountId, publicKey) {
  const near = await connect(config);
  const account = await near.account(accountId);
  await account.deleteKey(publicKey);
}
