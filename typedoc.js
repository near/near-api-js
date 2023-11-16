const GITHUB_BASE = "https://few-sw.github.io/near-api-js/"

module.exports = {
    "externalSymbolLinkMappings": {
        "providers/json-rpc-provider": {
            "JsonRpcProvider_sendTransaction": `${GITHUB_BASE}/classes/_near_js_providers.json_rpc_provider.JsonRpcProvider.html#sendTransaction`
        },
        "utils/key_pair": {
            "KeyPair": `${GITHUB_BASE}/modules/near_api_js.utils_key_pair.html`
        },
        "key_stores/browser_local_storage_key_store": { 
            "BrowserLocalStorageKeyStore": `${GITHUB_BASE}/classes/_near_js_keystores_browser.browser_local_storage_key_store.BrowserLocalStorageKeyStore.html`
        }
    }
}


