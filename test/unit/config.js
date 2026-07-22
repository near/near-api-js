let sandbox;
module.exports = async function getConfig(env) {
    switch (env) {
        case 'production':
        case 'mainnet':
            return {
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                walletUrl: 'https://wallet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
            };
        case 'development':
        case 'testnet':
            return {
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                masterAccount: 'test.near',
            };
        case 'betanet':
            return {
                networkId: 'betanet',
                nodeUrl: 'https://rpc.betanet.near.org',
                walletUrl: 'https://wallet.betanet.near.org',
                helperUrl: 'https://helper.betanet.near.org',
            };
        case 'local':
            return {
                networkId: 'local',
                nodeUrl: 'http://localhost:3030',
                keyPath: `${process.env.HOME}/.near/validator_key.json`,
                walletUrl: 'http://localhost:4000/wallet',
            };
        case 'test':
        case 'ci': {
            if (!sandbox) {
                const { Sandbox } = await import('near-sandbox');
                sandbox = await Sandbox.start({});
            }
            const { DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY } = await import('near-sandbox');
            return {
                networkId: 'sandbox',
                nodeUrl: sandbox.rpcUrl,
                masterAccount: DEFAULT_ACCOUNT_ID,
                secretKey: DEFAULT_PRIVATE_KEY,
                sandbox,
            };
        }
        default:
            throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
    }
};
