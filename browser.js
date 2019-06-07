const nearlib = require('./lib');

module.exports = {
    InMemoryKeyStore: nearlib.keyStores.InMemoryKeyStore,
    BrowserLocalStorageKeyStore: nearlib.keyStores.BrowserLocalStorageKeyStore,

    Account: nearlib.Account,
    Contract: nearlib.Contract,
    Connection: nearlib.Connection,

    connect: nearlib.connect,
};
