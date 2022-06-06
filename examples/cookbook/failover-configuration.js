// Demonstrates how to use failover functionality RPC Servers
const { providers, connect } = require("near-api-js");

const MAIN_RPC_SERVER = '<RPC Server 1>';
const FAILOVER_RPC_SERVER_1 = '<RPC Server 2>';
const FAILOVER_RPC_SERVER_2 = '<RPC Server 1>';

// Provider example
const provider = new providers.JsonRpcProvider({
    // preoritized list of RPC Servers
    url: [MAIN_RPC_SERVER, FAILOVER_RPC_SERVER_1, FAILOVER_RPC_SERVER_2],
});

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}

getNetworkStatus();

// Connection example
const ACCOUNT_ID = "<Account ID>";

const config = {
    networkId: 'testnet',
    nodeUrl: [MAIN_RPC_SERVER, FAILOVER_RPC_SERVER_1, FAILOVER_RPC_SERVER_2],
};

async function getState(accountId) {
    const near = await connect(config);
    const account = await near.account(accountId);
    const state = await account.state();
    console.log(state);
}

getState(ACCOUNT_ID);