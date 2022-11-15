const nearApi = require('../src/index');
const testUtils  = require('./test-utils');
let ERRORS_JSON = require('../src/res/error_messages.json');

jest.setTimeout(20000);

const withProvider = (fn) => {
  const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'));
  const provider = new nearApi.providers.JsonRpcProvider(config.nodeUrl);
  return () => fn(provider);
};

test('JSON RPC Error: MethodNotFound', withProvider(async (provider) => {
  const near = await testUtils.setUpTestConnection();
  const account = await testUtils.createAccount(near);
  const contract = await testUtils.deployContract(account, testUtils.generateUniqueString('test'));

  await contract.setValue({ args: { value: 'hello' } });

    try {
      const response = await provider.query({
          request_type: 'call_function',
          finality: 'final',
          account_id: contract.contractId,
          method_name: 'methodNameThatDoesNotExist',
          args_base64: ''
      });
      expect(response).toBeUndefined();
    } catch (e) {
      const errorType = 'MethodNotFound';
      expect(e.type).toEqual(errorType);
      expect(e.message).toEqual(ERRORS_JSON[errorType]);
    }

}));

test('JSON RPC Error: CodeDoesNotExist', withProvider(async (provider) => {
    try {
      const response = await provider.query({
          request_type: 'call_function',
          finality: 'final',
          account_id: 'test.near',
          method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
          args_base64: ''
      });
      expect(response).toBeUndefined();
    } catch (e) {
      const errorType = 'CodeDoesNotExist';
      expect(e.type).toEqual(errorType);
      expect(e.message.split(' ').slice(0, 5)).toEqual(ERRORS_JSON[errorType].split(' ').slice(0, 5));
    }
}));

test('JSON RPC Error: AccountDoesNotExist', withProvider(async (provider) => {
  const accountName = 'abc.near';
  try {
    const response = await provider.query({
        request_type: 'call_function',
        finality: 'final',
        account_id: accountName,
        method_name: 'methodNameThatDoesNotExistOnContractNotDeployed',
        args_base64: ''
    });
    expect(response).toBeUndefined();
  } catch (e) {
    const errorType = 'AccountDoesNotExist';
    expect(e.type).toEqual(errorType);
    expect(e.message).toEqual(`[-32000] Server error: account ${accountName} does not exist while viewing`);
  }
}));