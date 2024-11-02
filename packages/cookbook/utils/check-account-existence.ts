import {
  getAccountState,
  getTestnetRpcProvider,
} from '@near-js/client';

export default async function accountExists() {
  const isRegisteredAccount = async (account: string) => {
    try {
      await getAccountState({
        account,
        deps: {
          rpcProvider: getTestnetRpcProvider(),
        },
      });
    } catch (e) {
      if (e.type === 'AccountDoesNotExist') {
        return false;
      }
    }

    return true;
  };

  for (const account of ['does-not-exist.mike.testnet', 'mike.testnet']) {
    const succeeded = await isRegisteredAccount(account);
    console.log(succeeded ? `The account ${account} exists.` : `There is no account ${account}.`);
  }
}
