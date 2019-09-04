module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'development':
        return {
            networkId: 'default',
            nodeUrl: 'https://rpc.nearprotocol.com',
            masterAccount: 'test.near',
        };
    case 'local':
        return {
            networkId: 'local',
            nodeUrl: 'http://localhost:3030',
            keyPath: `${process.env.HOME}/.near/validator_key.json`,
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
            nodeUrl: 'http://shared-test.nearprotocol.com:3030',
            masterAccount: 'test.near',
        };
    case 'ci-staging':
        return {
            networkId: 'shared-test-staging',
            nodeUrl: 'http://staging-shared-test.nearprotocol.com:3030',
            masterAccount: 'test.near',
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in test/config.js.`);
    }
};
