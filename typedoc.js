const GITHUB_BASE = "https://few-sw.github.io/near-api-js"

module.exports = {
    "externalSymbolLinkMappings": {
        "account": {
            "Account": `${GITHUB_BASE}/classes/_near_js_accounts.account.Account.html`
        },
        "account_creator": {
            "AccountCreator": `${GITHUB_BASE}/classes/near_api_js.account_creator.AccountCreator.html`,
            "LocalAccountCreator": `${GITHUB_BASE}/classes/near_api_js.account_creator.LocalAccountCreator.html`,
            "UrlAccountCreator": `${GITHUB_BASE}/classes/near_api_js.account_creator.UrlAccountCreator.html`,
        },
        "browserConnect": {
            "ConnectConfig.networkId": `${GITHUB_BASE}/interfaces/near_api_js.browserConnect.ConnectConfig.html`,
            "ConnectConfig.nodeUrl": `${GITHUB_BASE}/interfaces/near_api_js.browserConnect.ConnectConfig.html`,
            "ConnectConfig.keyStore": `${GITHUB_BASE}/interfaces/near_api_js.browserConnect.ConnectConfig.html`,
            "ConnectConfig": `${GITHUB_BASE}/interfaces/near_api_js.browserConnect.ConnectConfig.html`,
        },
        "Connect": {
            "ConnectConfig.networkId": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
            "ConnectConfig.nodeUrl": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
            "ConnectConfig.keyPath": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
            "ConnectConfig.keyStore": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
            "ConnectConfig.deps.keyStore": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
            "ConnectConfig": `${GITHUB_BASE}/interfaces/near_api_js.connect.ConnectConfig.html`,
        },
        "key_stores/browser_local_storage_key_store": { 
            "BrowserLocalStorageKeyStore": `${GITHUB_BASE}/classes/_near_js_keystores_browser.browser_local_storage_key_store.BrowserLocalStorageKeyStore.html`
        },
        "key_stores/in_memory_key_store": { 
            "InMemoryKeyStore": `${GITHUB_BASE}/classes/_near_js_keystores.in_memory_key_store.InMemoryKeyStore.html`
        },
        // "key_stores/keystore": {
        //     "KeyStore": `${GITHUB_BASE}/classes/_near_js_keystores.keystore.KeyStore.html`
        // },
        "near": {
            "Near":`${GITHUB_BASE}/classes/_near_js_wallet_account.near.Near.html`,
            "NearConfig":`${GITHUB_BASE}/interfaces/_near_js_wallet_account.near.NearConfig.html`,
        },
        "near-api-js": {
            "connect": `${GITHUB_BASE}/modules/near_api_js.connect.html`,
        },
        "providers/provider": {
            "AccessKeyView": `${GITHUB_BASE}/interfaces/near_api_js.providers_provider.AccessKeyView.html`,
            "provider": `${GITHUB_BASE}/modules/_near_js_providers.html`,
            "BlockReference": `${GITHUB_BASE}/types/_near_js_types.provider_protocol.BlockReference.html`,
            "BlockId": `${GITHUB_BASE}/types/_near_js_types.provider_protocol.BlockId.html`,
            "RpcQueryRequest": `${GITHUB_BASE}/types/near_api_js.providers_provider.RpcQueryRequest.html`,
        },
        "providers/json-rpc-provider": {
            "JsonRpcProvider_sendTransaction": `${GITHUB_BASE}/classes/_near_js_providers.json_rpc_provider.JsonRpcProvider.html#sendTransaction`,
            "JsonRpcProvider": `${GITHUB_BASE}/classes/_near_js_providers.json_rpc_provider.JsonRpcProvider.html`,
        },
        "signer": {
            "InMemorySigner": `${GITHUB_BASE}/classes/_near_js_signers.in_memory_signer.InMemorySigner.html`
        },
        "utils/key_pair": {
            "PublicKey": `${GITHUB_BASE}/classes/_near_js_crypto.public_key.PublicKey.html#fromString`,
            "KeyPair": `${GITHUB_BASE}/classes/_near_js_crypto.key_pair.KeyPair.html#fromString`,
        },
        "walletAccount": {
            "WalletConnection": `${GITHUB_BASE}/classes/_near_js_wallet_account.walletAccount.WalletConnection.html`
        },
        // "": {
        //     "": `${GITHUB_BASE}`
        // },
        // "": {
        //     "": `${GITHUB_BASE}`
        // },
    }
}



