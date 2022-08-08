const { Near } = require('../src/index');
const getConfig = require('./config');

describe('Near', () => {
    test('throws if walletUrl is not defined', async() => {
        expect(() => new Near({})).toThrow('walletUrl is required but was not supplied');
    });

    test('instantiates successfully', () => {
        const near = new Near(getConfig('test'));
        expect(near).toBeDefined();
    });
});
