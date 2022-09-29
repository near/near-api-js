const { connect, keyStores } = require('near-api-js');
const path = require('path');
const homedir = require('os').homedir();

const CREDENTIALS_DIR = '.near-credentials';
// block hash of query start (oldest block)
const START_BLOCK_HASH = 'GZ8vKdcgsavkEndkDWHCjuhyqSR2TGnp9VDZbTzd6ufG';
// block hash of query end (newest block)
const END_BLOCK_HASH = '8aEcKhF7N1Jyw84e6vHW6Hzp3Ep7mSXJ6Rvnsy5qGJPF';
// contract ID or account ID you want to find transactions details for
const CONTRACT_ID = 'relayer.ropsten.testnet';

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

// NOTE: we're using the archival rpc to look back in time for a specific set
// of transactions. For a full list of what nodes are available, visit:
// https://docs.near.org/docs/develop/node/intro/types-of-node
const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://archival-rpc.testnet.near.org',
};

async function getTransactions(startBlock, endBlock, accountId) {
    const near = await connect(config);

    // creates an array of block hashes for given range
    const blockArr = [];
    let blockHash = endBlock;
    do {
        const currentBlock = await getBlockByID(blockHash);
        blockArr.push(currentBlock.header.hash);
        blockHash = currentBlock.header.prev_hash;
        console.log('working...', blockHash);
    } while (blockHash !== startBlock);

    // returns block details based on hashes in array
    const blockDetails = await Promise.all(
        blockArr.map((blockId) =>
            near.connection.provider.block({
                blockId,
            })
        )
    );

    // returns an array of chunk hashes from block details
    const chunkHashArr = blockDetails.flatMap((block) =>
        block.chunks.map(({ chunk_hash }) => chunk_hash)
    );

    //returns chunk details based from the array of hashes
    const chunkDetails = await Promise.all(
        chunkHashArr.map(chunk => near.connection.provider.chunk(chunk))
    );

    // checks chunk details for transactions
    // if there are transactions in the chunk we
    // find ones associated with passed accountId
    const transactions = chunkDetails.flatMap((chunk) =>
        (chunk.transactions || []).filter((tx) => tx.signer_id === accountId)
    );

    //creates transaction links from matchingTxs
    const txsLinks = transactions.map((txs) => ({
        method: txs.actions[0].FunctionCall.method_name,
        link: `https://explorer.testnet.near.org/transactions/${txs.hash}`,
    }));
    console.log('MATCHING TRANSACTIONS: ', transactions);
    console.log('TRANSACTION LINKS: ', txsLinks);
}

async function getBlockByID(blockID) {
    const near = await connect(config);
    return near.connection.provider.block({
        blockId: blockID,
    });
}

if (require.main === module) {
    (async function () {
        await getTransactions(START_BLOCK_HASH, END_BLOCK_HASH, CONTRACT_ID);
    }());
}
