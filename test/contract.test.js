const { Contract } = require('../lib/contract');
const { PositionalArgsError } = require('../lib/utils/errors');

const account = {
    viewFunction() {
        return this;
    },
    functionCall() {
        return this;
    }
};

const contract = new Contract(account, null, {
    viewMethods: ['viewMethod'],
    changeMethods: ['changeMethod'],
});

['viewMethod', 'changeMethod'].forEach(method => {
    describe(method, () => {
        test('returns what you expect for .name', () => {
            expect(contract[method].name).toBe(method);
        });

        test('maintains correct reference to `this` when passed around an application', async () => {
            function callFuncInNewContext(fn) {
                return fn();
            }
            expect(await callFuncInNewContext(contract[method]));
        });

        test('throws PositionalArgsError if first argument is not an object', () => {
            return Promise.all([
                1,
                'lol',
                [],
                new Date(),
                null,
                new Set(),
            ].map(async badArgs => {
                try {
                    await contract[method](badArgs);
                    throw new Error(`Calling \`contract.${method}(${badArgs})\` worked. It shouldn't have worked.`);
                } catch (e) {
                    if (!(e instanceof PositionalArgsError)) throw e;
                }
            }));
        });

        test('throws PositionalArgsError if given too many arguments', () => {
            return expect(contract[method]({}, 1, 0, 'oops')).rejects.toBeInstanceOf(PositionalArgsError);
        });
    });
});

describe('changeMethod', () => {
    test('throws error message for invalid gas argument', () => {
        return expect(contract.changeMethod({ a: 1}, 'whatever')).rejects.toThrow(/Expected number, decimal string or BN for 'gas' argument, but got.+/);
    });

    test('gives error message for invalid amount argument', () => {
        return expect(contract.changeMethod({ a: 1}, 1000, 'whatever')).rejects.toThrow(/Expected number, decimal string or BN for 'amount' argument, but got.+/);
    });

});
