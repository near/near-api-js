const { keyStores } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();

const ACCOUNT_ID = "near-example.testnet";
const CREDENTIALS_DIR = ".near-credentials";

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

verifySignature();

async function verifySignature() {
    const keyPair = await keyStore.getKey(config.networkId, ACCOUNT_ID);
    const msg = Buffer.from("hi");

    const { signature } = keyPair.sign(msg);

    const isValid = keyPair.verify(msg, signature);

    console.log("Signature Valid?:", isValid);

    return isValid;
}
