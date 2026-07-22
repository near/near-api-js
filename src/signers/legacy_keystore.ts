import fs from 'fs';
import os from 'os';
import path from 'path';
import { KeyPair, type KeyPairString } from '../crypto/index.js';
import { KeyPairSigner } from './key_pair_signer.js';

/**
 * Signs using local credentials stored in the .near-credentials directory.
 *
 * @param accountId - The NEAR account ID for which to load credentials.
 * @param networkId - The NEAR network ID (e.g., "mainnet", "testnet"). Defaults to "testnet".
 * @returns A KeyPairSigner instance initialized with the loaded credentials.
 * @throws Will throw an error if the credentials path or file does not exist, or if the file format is invalid.
 *
 * @example
 * const signer = new LegacyKeyStore("my-account.testnet");
 * const publicKey = await signer.getPublicKey();
 * console.log(publicKey.toString());
 */
export class LegacyKeyStoreSigner extends KeyPairSigner {
    constructor(accountId: string, networkId: 'testnet' | 'mainnet' = 'testnet') {
        const localCredentialsPath = path.join(os.homedir(), '.near-credentials', networkId);
        if (!fs.existsSync(localCredentialsPath)) {
            throw new Error(`Credential path does not exist: ${localCredentialsPath}`);
        }

        const credentialFile = path.join(localCredentialsPath, `${accountId}.json`);
        if (!fs.existsSync(credentialFile)) {
            throw new Error(`Credentials not found for ${accountId} at path: ${credentialFile}`);
        }

        const credentialData = JSON.parse(fs.readFileSync(credentialFile, 'utf-8'));
        if (!credentialData || !credentialData.private_key) {
            throw new Error(`Invalid credential file format at: ${credentialFile}`);
        }

        const keyPair = KeyPair.fromString(credentialData.private_key as KeyPairString);
        super(keyPair);
    }
}
