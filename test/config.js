module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'development':
        return {
            networkId: 'default',
            nodeUrl: 'http://34.94.33.164:3030',
            masterAccount: 'test.near',
        };
    case 'local':
        return {
            networkId: 'local',
            nodeUrl: 'http://localhost:3030',
            keyPath: '~/.near/validator_key.json',
        };
    case 'test':
        return {
            networkId: 'local',
            nodeUrl: 'http://localhost:3030',
            masterAccount: 'test.near',
        };
    case 'test-remote':
    case 'ci':
        return {
            networkId: 'shared-test',
            nodeUrl: 'http://34.94.13.241:3030',
            masterAccount: 'test.near',
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in test/config.js.`);
    }
};
