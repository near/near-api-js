module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'mainnet':
        return {
            networkId: 'mainnet',
            nodeUrl: 'https://rpc.mainnet.near.org',
            helperUrl: 'https://helper.mainnet.near.org',
        };
    case 'development':
    case 'testnet':
        return {
            networkId: 'default',
            nodeUrl: 'https://rpc.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
            masterAccount: 'test.near',
        };
    case 'betanet':
        return {
            networkId: 'betanet',
            nodeUrl: 'https://rpc.betanet.near.org',
            helperUrl: 'https://helper.betanet.near.org',
        };
    case 'local':
        return {
            networkId: 'local',
            nodeUrl: 'http://localhost:3030',
            keyPath: `${process.env.HOME}/.near/validator_key.json`,
        };
    case 'test':
    case 'ci':
        return {
            networkId: 'shared-test',
            nodeUrl: 'https://rpc.ci-testnet.near.org',
            masterAccount: 'test.near',
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
    }
};
