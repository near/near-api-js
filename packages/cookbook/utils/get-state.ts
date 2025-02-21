import { getTestnetRpcProvider, view } from '@near-js/client';

export default async function getState() {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    // call view method without parameters
    const result = await view({
        account: 'guest-book.testnet',
        method: 'getMessages',
        deps: { rpcProvider },
    });

    console.log(result);
}
