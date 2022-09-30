const { connect, keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

async function getTransactions({ accountId, endBlock, keyStore, networkId, nodeUrl, startBlock }) {
    const near = await connect({ keyStore, networkId, nodeUrl });

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

    // creates transaction links from matchingTxs
    const transactionLinks = transactions.map((txs) => ({
        method: txs.actions[0].FunctionCall.method_name,
        link: `https://explorer.testnet.near.org/transactions/${txs.hash}`,
    }));

    return {
        transactionLinks,
        transactions,
    };
}

async function getBlockByID({ blockId, keyStore, networkId, nodeUrl }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    return near.connection.provider.block({ blockId });
}

if (require.main === module) {
    (async function () {
        const contractName = 'relayer.ropsten.testnet'; // contract/account ID you want to find transactions details for
        const endBlock = '8aEcKhF7N1Jyw84e6vHW6Hzp3Ep7mSXJ6Rvnsy5qGJPF'; // block hash of query end (newest block)
        const networkId = 'testnet';
        const nodeUrl = 'https://archival-rpc.testnet.near.org';
        const startBlock = 'GZ8vKdcgsavkEndkDWHCjuhyqSR2TGnp9VDZbTzd6ufG'; // block hash of query start (oldest block)

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const response = await getTransactions({
            accountId: contractName,
            endBlock,
            keyStore,
            networkId,
            nodeUrl,
            startBlock,
        });
        console.log(response);
    }());
}
