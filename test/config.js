module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'development':
        return {
            nodeUrl: 'http://34.94.13.241:3030',
            masterAccount: 'test.near',
        };
    case 'local':
    case 'test':
        return {
            nodeUrl: 'http://localhost:3030',
            masterAccount: 'test.near',
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in test/config.js.`);
    }
};
