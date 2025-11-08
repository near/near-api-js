import type { FinalExecutionOutcome } from '@near-js/types';

import { KITWALLET_FUNDED_TESTNET_ACCOUNT_ENDPOINT } from './constants.js';
import { NewAccountParams } from './interfaces/index.js';

interface CreateFundedTestnetAccountParams extends NewAccountParams {
  endpointUrl?: string;
}

/**
 * Create a new funded testnet account via faucet REST endpoint
 *  (e.g. create `new.testnet` with a preset amount of Near)
 * @param endpointUrl REST endpoint for the funded testnet account creation (defaults to the current Near Contract Helper endpoint)
 * @param newAccount name of the created account
 * @param newPublicKey public key for the created account's initial full access key
 */
export async function createFundedTestnetAccount({
    newAccount,
    newPublicKey,
    endpointUrl = KITWALLET_FUNDED_TESTNET_ACCOUNT_ENDPOINT,
}: CreateFundedTestnetAccountParams) {
    const res = await fetch(endpointUrl, {
        method: 'POST',
        body: JSON.stringify({
            newAccountId: newAccount,
            newAccountPublicKey: newPublicKey,
        }),
        headers: { 'Content-Type': 'application/json' },
    });

    const { ok, status } = res;
    if (!ok) {
        throw new Error(`Failed to create account on ${endpointUrl}: ${status}`);
    }

    return await res.json() as FinalExecutionOutcome;
}
