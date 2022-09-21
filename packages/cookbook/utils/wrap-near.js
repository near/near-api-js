const HELP = `To convert N $NEAR to wNEAR,  run this script in the following format:

    node wrap-near.js YOU.near N

`;

const { connect, keyStores, transactions, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();

// On mainnet it's wrap.near, by the way
const WRAP_NEAR_CONTRACT_ID = "wrap.testnet";

const credentialsPath = path.join(homedir, ".near-credentials");
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
};

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

wrapNear(process.argv[2], process.argv[3]);

async function wrapNear(accountId, wrapAmount) {
  const near = await connect(config);
  const account = await near.account(accountId);

  const actions = [
    transactions.functionCall(
      "near_deposit", // contract method to deposit NEAR for wNEAR
      {},
      30000000000000, // attached gas
      utils.format.parseNearAmount(wrapAmount) // amount of NEAR to deposit and wrap
    ),
  ];

  // check if storage has been paid (the account has a wNEAR account)
  const storage = await account.viewFunction(
    WRAP_NEAR_CONTRACT_ID,
    "storage_balance_of",
    { account_id: accountId }
  );

  // if storage hasn't been paid, pay for storage (create an account)
  if (!storage) {
    actions.unshift(
      transactions.functionCall(
        "storage_deposit", // method to create an account
        {},
        30000000000000, // attached gas
        utils.format.parseNearAmount('0.00125') // account creation costs 0.00125 NEAR for storage
      )
    );
  }

  // send batched transaction
  return account.signAndSendTransaction({
    receiverId: WRAP_NEAR_CONTRACT_ID,
    actions,
  });
}
