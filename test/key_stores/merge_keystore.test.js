const nearlib = require('../../lib/index');

const MergeKeyStore = nearlib.keyStores.MergeKeyStore;
const InMemoryKeyStore = nearlib.keyStores.InMemoryKeyStore;

describe('Merge keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.stores = [new InMemoryKeyStore(), new InMemoryKeyStore()];
        ctx.keyStore = new MergeKeyStore(ctx.stores);
    });

    afterAll(async () => {
        expect(await ctx.stores[0].getAccounts('twoKeyNetwork')).toHaveLength(2);
        expect(await ctx.stores[1].getAccounts('twoKeyNetwork')).toHaveLength(0);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
