import { readKeyFile } from './key_stores/unencrypted_file_system_keystore';
import { InMemoryKeyStore, MergeKeyStore } from './key_stores';
import { Near, NearConfig } from './near';

export type ConnectConfig = NearConfig & {
    keyPath?: string;
}

/**
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const accountKeyFile = await readKeyFile(config.keyPath);
            if (accountKeyFile[0]) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountKeyFile[0];
                }
                config.deps.keyStore = new MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        } catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}