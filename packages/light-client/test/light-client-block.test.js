const { JsonRpcProvider } = require('@near-js/providers');
const { validateLightClientBlock, computeBlockHash } = require("../src/index");
const base58 = require('bs58');

jest.setTimeout(20000);

const withProvider = (fn) => {
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
    const provider = new JsonRpcProvider(config.nodeUrl);
    return () => fn(provider);
};

test('json rpc get next light client block with validation', withProvider(async (provider) => {
    const stat = await provider.status();

    // Get block in at least the last epoch (epoch duration 43,200 blocks on mainnet and testnet)
    const height = stat.sync_info.latest_block_height;
    const protocolConfig = await provider.experimental_protocolConfig({ finality: 'final' });

    // NOTE: This will underflow if the network used has not produced an epoch yet. If a new network
    // config is required, can retrieve a block a few height behind (1+buffer for indexing). If run
    // on a fresh network, would need to wait for blocks to be produced and indexed.
    const firstBlockHeight = height - protocolConfig.epoch_length * 2;
    const firstBlock = await provider.block({ blockId: firstBlockHeight });
    const prevBlock = await provider.nextLightClientBlock({ last_block_hash: firstBlock.header.hash });
    const nextBlock = await provider.nextLightClientBlock({ last_block_hash: base58.encode(computeBlockHash(prevBlock)) });
    expect('inner_lite' in nextBlock).toBeTruthy();
    // Verify that requesting from previous epoch includes the set of new block producers.
    expect('next_bps' in nextBlock).toBeTruthy();

    // Greater than or equal check because a block could have been produced during the test.
    // There is a buffer of 10 given to the height, because this seems to be lagging behind the
    // latest finalized block by a few seconds. This delay might just be due to slow or delayed
    // indexing in a node's db. If this fails in the future, we can increase the buffer.
    expect(nextBlock.inner_lite.height).toBeGreaterThanOrEqual(height - 10);
    expect(nextBlock.inner_lite.height).toBeGreaterThan(prevBlock.inner_lite.height);
    expect('prev_block_hash' in nextBlock).toBeTruthy();
    expect('next_block_inner_hash' in nextBlock).toBeTruthy();
    expect('inner_rest_hash' in nextBlock).toBeTruthy();
    expect('approvals_after_next' in nextBlock).toBeTruthy();

    validateLightClientBlock({ lastKnownBlock: prevBlock, currentBlockProducers: prevBlock.next_bps, newBlock: nextBlock });
}));