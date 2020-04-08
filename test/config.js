module.exports = function getConfig(env) {
    switch (env) {
    case 'production':
    case 'development':
        return {
            networkId: 'default',
            nodeUrl: 'https://rpc.nearprotocol.com',
            masterAccount: 'test.near',
        };
    case 'devnet':
        return {
            networkId: 'devnet',
            nodeUrl: 'https://rpc.devnet.nearprotocol.com',
            walletUrl: 'https://wallet.devnet.nearprotocol.com',
            helperUrl: 'https://helper.devnet.nearprotocol.com',
        };
    case 'betanet':
        return {
            networkId: 'betanet',
            nodeUrl: 'https://rpc.betanet.nearprotocol.com',
            walletUrl: 'https://wallet.betanet.nearprotocol.com',
            helperUrl: 'https://helper.betanet.nearprotocol.com',
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
            nodeUrl: 'http://shared-test.nearprotocol.com:3030',
            masterAccount: 'test.near',
        };
    case 'ci-betanet':
        return {
            networkId: 'shared-test-staging',
            nodeUrl: 'http://rpc.ci-betanet.nearprotocol.com',
            masterAccount: 'test.near',
        };
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in test/config.js.`);
    }
};
