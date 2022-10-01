// demonstrates how to query the state without setting 
// up an account. (View methods only)
const { providers } = require('near-api-js');

async function getState({ contractName, methodName, nodeUrl }) {
    const provider = new providers.JsonRpcProvider({
        url: nodeUrl,
    });

    const rawResult = await provider.query({
        request_type: 'call_function',
        account_id: contractName,
        method_name: methodName,
        args_base64: 'e30=',
        finality: 'optimistic',
    });

    // format result
    return JSON.parse(Buffer.from(rawResult.result).toString());
}

module.exports = {
    getState,
};

if (require.main === module) {
    (async function () {
        const contractName = 'guest-book.testnet';
        const methodName = 'getMessages';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const state = await getState({ contractName, methodName, nodeUrl });
        console.log({ state });
    }());
}
