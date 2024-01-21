const { JsonRpcProvider } = require('@near-js/providers');
const testUtils = require('./test-utils');
let ERRORS_JSON = require('../../utils/lib/errors/error_messages.json');
const { KeyPair } = require('@near-js/crypto');

jest.setTimeout(30000);

const withProvider = (fn) => {
    const config = Object.assign(
        require('./config')(process.env.NODE_ENV || 'test')
    );
    const provider = new JsonRpcProvider({ url: config.nodeUrl });
    return () => fn(provider);
};

test(
    'JSON RPC Error: MethodNotFound',
    withProvider(async (provider) => {
        const near = await testUtils.setUpTestConnection();
        const account = await testUtils.createAccount(near);
        const contract = await testUtils.deployContract(
            account,
            testUtils.generateUniqueString('test')
        );

        await contract.setValue({ args: { value: 'hello' } });

        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'final',
                account_id: contract.contractId,
                method_name: 'methodNameThatDoesNotExist',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'MethodNotFound';
            expect(e.type).toEqual(errorType);
            expect(e.message).toEqual(ERRORS_JSON[errorType]);
        }
    })
);

test(
    'JSON RPC Error: CodeDoesNotExist',
    withProvider(async (provider) => {
        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'final',
                account_id: 'test.near',
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'CodeDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ERRORS_JSON[errorType].split(' ').slice(0, 5)
            );
        }
    })
);

test(
    'JSON RPC Error: AccountDoesNotExist',
    withProvider(async (provider) => {
        const accountName = 'abc.near';
        try {
            const response = await provider.query({
                request_type: 'call_function',
                finality: 'final',
                account_id: accountName,
                method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
                args_base64: '',
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'AccountDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ERRORS_JSON[errorType].split(' ').slice(0, 5)
            );
        }
    })
);

test(
    'JSON RPC Error: AccessKeyDoesNotExist',
    withProvider(async (provider) => {
        const near = await testUtils.setUpTestConnection();
        const { accountId } = await testUtils.createAccount(near);

        try {
            const response = await provider.query({
                request_type: 'view_access_key',
                finality: 'final',
                account_id: accountId,
                public_key: KeyPair.fromRandom('ed25519')
                    .getPublicKey()
                    .toString(),
            });
            expect(response).toBeUndefined();
        } catch (e) {
            const errorType = 'AccessKeyDoesNotExist';
            expect(e.type).toEqual(errorType);
            expect(e.message.split(' ').slice(0, 5)).toEqual(
                ERRORS_JSON[errorType].split(' ').slice(0, 5)
            );
        }
    })
);
