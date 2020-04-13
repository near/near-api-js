const nearApi = require('../../lib/index');

const KeyPair = nearApi.utils.KeyPairEd25519;

const MergeKeyStore = nearApi.keyStores.MergeKeyStore;
const InMemoryKeyStore = nearApi.keyStores.InMemoryKeyStore;

describe('Merge keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.stores = [new InMemoryKeyStore(), new InMemoryKeyStore()];
        ctx.keyStore = new MergeKeyStore(ctx.stores);
    });

    it('looks up key from fallback key store if needed', async () => {
        const key1 = KeyPair.fromRandom();
        await ctx.stores[1].setKey('network', 'account', key1);
        expect(await ctx.keyStore.getKey('network', 'account')).toEqual(key1);
    });

    it('looks up key in proper order', async () => {
        const key1 = KeyPair.fromRandom();
        const key2 = KeyPair.fromRandom();
        await ctx.stores[0].setKey('network', 'account', key1);
        await ctx.stores[1].setKey('network', 'account', key2);
        expect(await ctx.keyStore.getKey('network', 'account')).toEqual(key1);
    });

    it('sets keys only in first key store', async () => {
        const key1 = KeyPair.fromRandom();
        await ctx.keyStore.setKey('network', 'account', key1);
        expect(await ctx.stores[0].getAccounts('network')).toHaveLength(1);
        expect(await ctx.stores[1].getAccounts('network')).toHaveLength(0);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
