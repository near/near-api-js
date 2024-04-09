const { PositionalArgsError } = require('@near-js/types');

const { Contract, Account } = require('../lib');
const testUtils  = require('./test-utils');

const account = Object.setPrototypeOf({
    getConnection() {
        return {};
    },
    viewFunction({ contractId, methodName, args, parse, stringify, jsContract, blockQuery }) {
        return { this: this, contractId, methodName, args, parse, stringify, jsContract, blockQuery };
    },
    functionCall() {
        return this;
    }
}, Account.prototype);

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
        const stubbedReturnValue = await account.viewFunction({ parse: customParser });
        expect(stubbedReturnValue.parse).toBe(customParser);
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
        return expect(contract.changeMethod({ a: 1 }, 'whatever')).rejects.toThrow(/Expected number, decimal string or BigInt for 'gas' argument, but got.+/);
    });

    test('gives error message for invalid amount argument', () => {
        return expect(contract.changeMethod({ a: 1 }, 1000, 'whatever')).rejects.toThrow(/Expected number, decimal string or BigInt for 'amount' argument, but got.+/);
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


describe('local view execution', () => {
    let nearjs;
    let workingAccount;
    let contract;
    let blockQuery;

    jest.setTimeout(60000);

    beforeAll(async () => {
        nearjs = await testUtils.setUpTestConnection();
        workingAccount = await testUtils.createAccount(nearjs);
        contract = await testUtils.deployContractGuestBook(workingAccount, testUtils.generateUniqueString('guestbook'));
        
        await contract.add_message({ text: 'first message' });
        await contract.add_message({ text: 'second message' });
        
        const block = await contract.account.connection.provider.block({ finality: 'optimistic' });

        contract.account.connection.provider.query = jest.fn(contract.account.connection.provider.query);
        blockQuery = { blockId: block.header.height };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls total_messages() function using RPC provider', async () => {
        const totalMessages = await contract.total_messages({}, { blockQuery });

        expect(contract.account.connection.provider.query).toHaveBeenCalledWith({
            request_type: 'view_code',
            account_id: contract.contractId,
            ...blockQuery,
        });
        expect(totalMessages).toBe(2);
    });

    test('calls total_messages() function using cache data', async () => {
        const totalMessages = await contract.total_messages({}, { blockQuery });

        expect(contract.account.connection.provider.query).not.toHaveBeenCalled();
        expect(totalMessages).toBe(2);
    });

    test('calls get_messages() function using cache data', async () => {
        const messages = await contract.get_messages({}, { blockQuery });

        expect(contract.account.connection.provider.query).not.toHaveBeenCalled();
        expect(messages.length).toBe(2);
        expect(messages[0].text).toEqual('first message');
        expect(messages[1].text).toEqual('second message');
    });

    test('local execution fails and fallbacks to normal RPC call', async () => {
        const _contract = new Contract(contract.account, contract.contractId, { viewMethods: ['get_msg'], useLocalViewExecution: true });
        _contract.account.viewFunction = jest.fn(_contract.account.viewFunction);

        try {
            await _contract.get_msg({}, { blockQuery });
        } catch (error) {
            expect(_contract.account.viewFunction).toHaveBeenCalledWith({
                contractId: _contract.contractId,
                methodName: 'get_msg',
                args: {},
                blockQuery,
            });
        }
    }); 
});

describe('contract without account', () => {
    let nearjs;
    let workingAccount;
    let contract;

    jest.setTimeout(60000);

    beforeAll(async () => {
        nearjs = await testUtils.setUpTestConnection();
        workingAccount = await testUtils.createAccount(nearjs);
        const contractId = testUtils.generateUniqueString('guestbook');
        await testUtils.deployContractGuestBook(workingAccount, contractId);

        contract = new Contract(nearjs.connection, contractId, {
            viewMethods: ['total_messages', 'get_messages'],
            changeMethods: ['add_message'],
        });
    });

    test('view & change methods work', async () => {
        const totalMessagesBefore = await contract.total_messages({});
        expect(totalMessagesBefore).toBe(0);

        await contract.add_message({
            signerAccount: workingAccount,
            args: {
                text: 'first message',
            }
        });
        await contract.add_message({
            signerAccount: workingAccount,
            args: {
                text: 'second message',
            }
        });

        const totalMessagesAfter = await contract.total_messages({});
        expect(totalMessagesAfter).toBe(2);

        const messages = await contract.get_messages({});
        expect(messages.length).toBe(2);
        expect(messages[0].text).toEqual('first message');
        expect(messages[1].text).toEqual('second message');
    });

    test('fails to call add_message() without signerAccount', async () => {
        await expect(
            contract.add_message({ text: 'third message' })
        ).rejects.toThrow(/signerAccount must be specified/);
    });
});
