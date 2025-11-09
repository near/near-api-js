import { createSandboxInfo } from '@near-js/sandbox';

export default async function getConfig(env: string) {
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
            const { server, keyPair } = await createSandboxInfo();
            return {
                networkId: 'sandbox',
                nodeUrl: server.endpoint,
                masterAccount: keyPair.account_id,
                secretKey: keyPair.secret_key,
                worker: {
                    tearDown: async () => {
                        await server.stop();
                    },
                },
            };
        }
        default:
            throw Error(
                `Unconfigured environment '${env}'. Can be configured in src/config.js.`,
            );
    }
}
