// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

//TODO: use https when it's available
const RPC_API_ENDPOINT = 'http://34.141.205.230:3030/';
//TODO: should we keep example API_KEY here?
const API_KEY = 'ZmowOTMyNHUwMnUzNDA5MnUzMDk0dTIzeA==';

const provider = new providers.JsonRpcProvider(
    RPC_API_ENDPOINT
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