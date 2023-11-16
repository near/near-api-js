NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

👉 **[Learn how to use](https://docs.near.org/tools/near-api-js/quick-reference) the library in your project.**

## Resources

- [Cookbook](https://github.com/near/near-api-js/blob/master/packages/cookbook/README.md) with common use cases

- To quickly get started with integrating NEAR in a _web browser_, read our [Web Frontend integration](https://docs.near.org/develop/integrate/frontend) article.

- Explore the code in [project's repository](https://github.com/near/near-api-js)

- Read [NEAR documentation](https://docs.near.org)

- [RPC Endpoints](https://docs.near.org/api/rpc/introduction) reference

## Modules

### Connect to NEAR

- [From the browser](modules/near_api_js.browserConnect.html)
- [From Node.js](modules/near_api_js.connect.html)

### Managing Accounts

- Class [`Account`](classes/_near_js_accounts.account.Account.html)
- Module [`walletAccount`](modules/_near_js_wallet_account.walletAccount.html)
- Class [`Contract`](classes/_near_js_accounts.contract.Contract.html)

### Managing Keys

- Module [`utils/key_pair`](modules/near_api_js.utils_key_pair.html)
- Class [`BrowserLocalStorageKeyStore`](classes/near_api_js.key_stores_browser_local_storage_key_store.BrowserLocalStorageKeyStore.html)
- Class [`InMemoryKeyStore`](classes/_near_js_keystores.in_memory_key_store.InMemoryKeyStore.html)
- Class [`UnencryptedFileSystemKeyStore`](classes/_near_js_keystores_node.unencrypted_file_system_keystore.UnencryptedFileSystemKeyStore.html)
- Class [`MergeKeyStore`](classes/_near_js_keystores.merge_key_store.MergeKeyStore.html)

### RPC

- [Request and Response Types](modules/_near_js_types.provider.html)
- [Client](classes/_near_js_providers.json_rpc_provider.JsonRpcProvider.html)

### Utils

- [Formatting utils](modules/_near_js_utils.format.html)
