module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'development':
        return {
            nodeUrl: 'https://studio.nearprotocol.com/devnet',
            helperUrl: 'https://studio.nearprotocol.com/contract-api',
            useDevAccount: true
        };
    case 'local':
    case 'test':
        return {
            nodeUrl: 'http://localhost:3030',
            useDevAccount: true
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in test/config.js.`);
    }
};
