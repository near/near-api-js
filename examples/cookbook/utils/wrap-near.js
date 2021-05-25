const { connect, keyStores, transactions, utils } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();

const WRAP_NEAR_CONTRACT_ID = "wrap.near";

const credentialsPath = path.join(homedir, ".near-credentials");
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
  keyStore,
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
};

// Wrap 1 NEAR to wNEAR
wrapNear("example.near", "1");

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
        1250000000000000000000 // account creation costs 0.00125 NEAR for storage
      )
    );
  }

  // send batched transaction
  return account.signAndSendTransaction({
    receiverId: WRAP_NEAR_CONTRACT_ID,
    actions,
  });
}
