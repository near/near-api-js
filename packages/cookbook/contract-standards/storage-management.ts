/**
 * This serves both as a demo of interfacing with a Storage Management Standard
 * contract and a basic test of the client library
 * 
  * Tested against near-sdk-rs example FT contract:
 * https://github.com/near/near-sdk-rs/tree/master/examples/fungible-token
 * 
 * Reproduction steps:
 * - create two test accounts: hereafter referred to as CONTRACT_ID, ACCOUNT_ID
 * - clone and build contract
* - deploy with init call
 *   - `near contract deploy <CONTRACT_ID> use-file res/fungible_token.wasm with-init-call new_default_meta json-args '{"owner_id":"<ACCOUNT_ID>","total_supply":"10000"}' prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`
 * - run this script
 *   - `pnpm storageManagementStandard -- <CONTRACT_ID> <ACCOUNT_ID>`
 */

import {
    getSignerFromKeystore,
    getTestnetRpcProvider,
    storageDeposit,
    storageWithdraw,
    storageUnregister,
    storageBalanceBounds,
    storageBalanceOf,
} from "@near-js/client";
import { UnencryptedFileSystemKeyStore } from "@near-js/keystores-node";
import chalk from "chalk";
import { join } from "node:path";
import { homedir } from "node:os";

export default async function storageManagementStandard(
    contractAddress: string,
    accountId: string
) {
    // run serially since calls may rely on previous calls
    await storageBalanceBoundsCall(contractAddress);
    await storageDepositCall(contractAddress, accountId);
    // check balance after deposit, should exist
    await storageBalanceOfCall(contractAddress, accountId);
    try  {
        await storageWithdrawCall(contractAddress, accountId);
    } catch (e) {
        if (e.message.includes("amount is greater than the available storage balance")) {
            console.log("EXPECTED FAILURE during storage_withdraw since testing against a contract with fixed storage amount:", e);
        } else {
            console.log("Unexpected error during storage_withdraw:", e);
        }
    }
    await storageUnregisterCall(contractAddress, accountId);
    // check balance after unregister, should not exist
    await storageBalanceOfCall(contractAddress, accountId);
}

export async function storageDepositCall(
    contractAddress: string,
    accountId: string
) {
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm storageManagementStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { result } = await storageDeposit({
        receiver: contractAddress,
        sender: accountId,
        args: {
            account_id: accountId,
            registration_only: false,
        },
        deps: {
            rpcProvider,
            signer,
        },
        deposit: 1000000000000000000000000n,
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_deposit}
{white ------------------------------------------------------------------------ }
{bold.white Total}     {white |} {bold.yellow ${result.total}}
{bold.white Available} {white |} {bold.yellow ${result.available}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function storageWithdrawCall(
    contractAddress: string,
    accountId: string
) {
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm storageManagementStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { result } = await storageWithdraw({
        receiver: contractAddress,
        sender: accountId,
        args: {
            amount: 1000000000000000000000000n,
        },
        deps: {
            rpcProvider,
            signer,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_withdraw}
{white ------------------------------------------------------------------------ }
{bold.white Total}     {white |} {bold.yellow ${result.total}}
{bold.white Available} {white |} {bold.yellow ${result.available}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function storageUnregisterCall(
    contractAddress: string,
    accountId: string
) {
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm storageManagementStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { result } = await storageUnregister({
        receiver: contractAddress,
        sender: accountId,
        args: {
            force: true,
        },
        deps: {
            rpcProvider,
            signer,
        },
        deposit: 1n,
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_unregister}
{white ------------------------------------------------------------------------ }
{bold.white Result}     {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function storageBalanceBoundsCall(contractAddress: string) {
    if (!contractAddress) {
        console.log(
            chalk`{red pnpm storageManagementStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await storageBalanceBounds({
        args: undefined, // TODO: figure out how to pass in empty object
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_balance_bounds}
{white ------------------------------------------------------------------------ }
{bold.white Min}     {white |} {bold.yellow ${result.min}}
{bold.white Max}     {white |} {bold.yellow ${result.max}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function storageBalanceOfCall(
    contractAddress: string,
    accountId: string
) {
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm storageManagementStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await storageBalanceOf({
        args: {
            account_id: accountId,
        },
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    let output;
    if (result === null) {
        output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_balance_of}
{white ------------------------------------------------------------------------ }
{bold.white Result}     {white |} {bold.yellow ${null}}
{white ------------------------------------------------------------------------ }
  `;
    } else {
        output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white storage_balance_of}
{white ------------------------------------------------------------------------ }
{bold.white Total}     {white |} {bold.yellow ${result.total}}
{bold.white Available} {white |} {bold.yellow ${result.available}}
{white ------------------------------------------------------------------------ }
    `;
    }

    console.log(output);
}
