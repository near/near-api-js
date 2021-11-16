// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

const provider = new providers.JsonRpcProvider(
    'https://rpc.testnet.near.org'
);

getState();

async function getState() {
    const rawResult = await provider.query({
        request_type: 'call_function',
        account_id: 'guest-book.testnet',
        method_name: 'getMessages',
        args_base64: 'e30=',
        finality: 'optimistic',
    });

    // format result
    const res = JSON.parse(Buffer.from(rawResult.result).toString());
    console.log(res);
}