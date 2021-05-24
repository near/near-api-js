const { Contract } = require('../src/contract');
const { PositionalArgsError } = require('../src/utils/errors');

const account = {
    viewFunction(contractId, methodName, args, options) {
        return { this: this, contractId, methodName, args, options };
    },
    functionCall() {
        return this;
    }
};

const contract = new Contract(account, 'contractId', {
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

        test('throws PositionalArgsError if first argument is not an object', async() => {
            await expect(contract[method](1)).rejects.toBeInstanceOf(PositionalArgsError);
            await expect(contract[method]('lol')).rejects.toBeInstanceOf(PositionalArgsError);
            await expect(contract[method]([])).rejects.toBeInstanceOf(PositionalArgsError);
            await expect(contract[method](new Date())).rejects.toBeInstanceOf(PositionalArgsError);
            await expect(contract[method](null)).rejects.toBeInstanceOf(PositionalArgsError);
            await expect(contract[method](new Set())).rejects.toBeInstanceOf(PositionalArgsError);
        });

        test('throws PositionalArgsError if given too many arguments', () => {
            return expect(contract[method]({}, 1, 0, 'oops')).rejects.toBeInstanceOf(PositionalArgsError);
        });

        test('allows args encoded as Uint8Array (for borsh)', async () => {
            expect(await contract[method](new Uint8Array()));
        });
    });
});

describe('viewMethod', () => {
    test('passes options through to account viewFunction', async () => {
        function customParser () {}
        const stubbedReturnValue = await contract.viewMethod({}, { parse: customParser });
        expect(stubbedReturnValue.options.parse).toBe(customParser);
    });

    describe.each([
        1,
        'lol',
        [],
        new Date(),
        null,
        new Set(),
    ])('throws PositionalArgsError if 2nd arg is not an object', badArg => {
        test(String(badArg), async () => {
            try {
                await contract.viewMethod({ a: 1 }, badArg);
                throw new Error(`Calling \`contract.viewMethod({ a: 1 }, ${badArg})\` worked. It shouldn't have worked.`);
            } catch (e) {
                if (!(e instanceof PositionalArgsError)) throw e;
            }
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

    test('makes a functionCall and passes along walletCallbackUrl and walletMeta', async() => {
        account.functionCall = jest.fn(() => Promise.resolve(account));
        await contract.changeMethod({
            args: {},
            meta: 'someMeta',
            callbackUrl: 'http://neartest.test/somepath?and=query',
        });

        expect(account.functionCall).toHaveBeenCalledWith({
            args: {},
            contractId: 'contractId',
            methodName: 'changeMethod',
            walletMeta: 'someMeta',
            walletCallbackUrl: 'http://neartest.test/somepath?and=query'
        });
    });
});
