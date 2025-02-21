import { getTestnetRpcArchivalProvider } from '@near-js/client';

// block hash of query start (oldest block)
const START_BLOCK_HASH = 'GZ8vKdcgsavkEndkDWHCjuhyqSR2TGnp9VDZbTzd6ufG';
// block hash of query end (newest block)
const END_BLOCK_HASH = '8aEcKhF7N1Jyw84e6vHW6Hzp3Ep7mSXJ6Rvnsy5qGJPF';
// contract ID or account ID you want to find transactions details for
const CONTRACT_ID = 'relayer.ropsten.testnet';

export default async function traverseBlocks(
    startBlockHash: string = START_BLOCK_HASH,
    endBlockHash: string = END_BLOCK_HASH,
    contractId: string = CONTRACT_ID,
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcArchivalProvider();

    // creates an array of block hashes for given range
    const blockArr = [];
    let blockHash = endBlockHash;
    do {
        const currentBlock = await rpcProvider.block({ blockId: blockHash });
        blockArr.push(currentBlock.header.hash);
        blockHash = currentBlock.header.prev_hash;
        console.log('working...', blockHash);
    } while (blockHash !== startBlockHash);

    // returns block details based on hashes in array
    const blockDetails = await Promise.all(blockArr.map((blockId) => rpcProvider.block({ blockId })));

    // returns an array of chunk hashes from block details
    const chunkHashArr = blockDetails.flatMap((block) => block.chunks.map(({ chunk_hash }) => chunk_hash));

    //returns chunk details based from the array of hashes
    const chunkDetails = await Promise.all(chunkHashArr.map((chunk) => rpcProvider.chunk(chunk)));

    // checks chunk details for transactions
    // if there are transactions in the chunk we
    // find ones associated with passed accountId
    const transactions = chunkDetails.flatMap((chunk) =>
        (chunk.transactions || []).filter((tx) => tx.signer_id === contractId),
    );

    //creates transaction links from matchingTxs
    const txsLinks = transactions.map((txs) => ({
        method: txs.actions[0].FunctionCall.method_name,
        link: `https://explorer.testnet.near.org/transactions/${txs.hash}`,
    }));
    console.log('MATCHING TRANSACTIONS: ', transactions);
    console.log('TRANSACTION LINKS: ', txsLinks);
}
