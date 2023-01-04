const { KeyPairEd25519 } = require('@near-js/keypairs');

const { InMemoryKeyStore, MergeKeyStore } = require('../lib');

describe('Merge keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.stores = [new InMemoryKeyStore(), new InMemoryKeyStore()];
        ctx.keyStore = new MergeKeyStore(ctx.stores);
    });

    it('looks up key from fallback key store if needed', async () => {
        const key1 = KeyPairEd25519.fromRandom();
        await ctx.stores[1].setKey('network', 'account', key1);
        expect(await ctx.keyStore.getKey('network', 'account')).toEqual(key1);
    });

    it('looks up key in proper order', async () => {
        const key1 = KeyPairEd25519.fromRandom();
        const key2 = KeyPairEd25519.fromRandom();
        await ctx.stores[0].setKey('network', 'account', key1);
        await ctx.stores[1].setKey('network', 'account', key2);
        expect(await ctx.keyStore.getKey('network', 'account')).toEqual(key1);
    });

    it('sets keys only in first key store', async () => {
        const key1 = KeyPairEd25519.fromRandom();
        await ctx.keyStore.setKey('network', 'account', key1);
        expect(await ctx.stores[0].getAccounts('network')).toHaveLength(1);
        expect(await ctx.stores[1].getAccounts('network')).toHaveLength(0);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
