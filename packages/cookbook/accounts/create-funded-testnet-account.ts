import { homedir } from 'node:os';
import { join } from 'node:path';
import { createFundedTestnetAccount, generateRandomKeyPair } from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';

export default async function createFundedTestnetAccountCookbook(accountId: string) {
    if (!accountId) {
        console.log(chalk`{red pnpm createFundedTestnetAccount -- ACCOUNT_ID}`);
        return;
    }

    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const keystore = new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials'));

    // create new keypair and persist it to filesystem keystore
    const keyPair = generateRandomKeyPair('ed25519');
    await keystore.setKey('testnet', accountId, keyPair);

    // call funded testnet creation endpoint
    await createFundedTestnetAccount({
        newAccount: accountId,
        newPublicKey: keyPair.getPublicKey().toString(),
    });

    console.log(chalk`{white ------------------------------------------------------------------------ }`);
    console.log(chalk`{bold.green RESULTS} {white Created funded testnet account}`);
    console.log(chalk`{white ------------------------------------------------------------------------ }`);
    console.log(
        chalk`{bold.white New Account} {white |} {bold.yellow ${accountId}} {white |} {bold.yellow ${keyPair.getPublicKey().toString()}}`,
    );
    console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
