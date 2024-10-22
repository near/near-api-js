/**
 * This serves both as a demo of interfacing with a Fungible Token Standard
 * contract and a basic test of the client library
 * 
 * ! NOTE: These examples may not work with a JS/TS contract since near-sdk-js
 * !       has some type differences from the NEP standards, see comments in
 * !       @near-js/client/src/contract-standards/fungible-token.ts
 * 
 * Tested against near-sdk-rs example FT contract:
 * https://github.com/near/near-sdk-rs/tree/master/examples/fungible-token
 * 
 * Reproduction steps:
 * - create three test accounts: hereafter referred to as CONTRACT_ID, ACCOUNT_ID, RECEIVER_ID
 * - clone and build contract
 * - deploy with init call
 *   - `near contract deploy <CONTRACT_ID> use-file res/fungible_token.wasm with-init-call new_default_meta json-args '{"owner_id":"<ACCOUNT_ID>","total_supply":"10000"}' prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`
 * - register RECEIVER_ID with the contract
 *   - `near contract call-function as-transaction <CONTRACT_ID> storage_deposit json-args '{"account_id":"<RECEIVER_ID>"}' prepaid-gas '100.0 Tgas' attached-deposit '0.5 NEAR' sign-as <RECEIVER_ID> network-config testnet sign-with-keychain send`
 * - run this script
 *   - `pnpm fungibleTokenStandard -- <CONTRACT_ID> <ACCOUNT_ID> <RECEIVER_ID>`
 * 
 * In order to test ftTransferCall, you will need to deploy a contract that
 * implements the receiving function. One is provided by `near-sdk-rs` and is built
 * alongside the FT contract:
 * https://github.com/near/near-sdk-rs/tree/master/examples/fungible-token/test-contract-defi
 * 
 * - create a new test account for the receiver contract: hereafter referred to as TRANSFER_CONTRACT_ID
 * - deploy with init call
 *   - `near contract deploy <TRANSFER_CONTRACT_ID> use-file res/defi.wasm with-init-call new json-args '{"fungible_token_account_id":"<CONTRACT_ID>"}' prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`
 * - register TRANSFER_CONTRACT_ID with the FT contract
 *   - `near contract call-function as-transaction <CONTRACT_ID> storage_deposit json-args '{"account_id":"<TRANSFER_CONTRACT_ID>"}' prepaid-gas '100.0 Tgas' attached-deposit '0.5 NEAR' sign-as <TRANSFER_CONTRACT_ID> network-config testnet sign-with-keychain send`
 * - run this script with an additional argument for the transfer contract address:
 *   - `pnpm fungibleTokenStandard -- <CONTRACT_ID> <ACCOUNT_ID> <RECEIVER_ID> <TRANSFER_CONTRACT_ID>`
 */

import {
    getSignerFromKeystore,
    getTestnetRpcProvider,
    ftTransfer,
    ftTransferCall,
    ftTotalSupply,
    ftBalanceOf,
    ftMetadata,
} from "@near-js/client";
import { UnencryptedFileSystemKeyStore } from "@near-js/keystores-node";
import chalk from "chalk";
import { join } from "node:path";
import { homedir } from "node:os";

export default async function fungibleTokenStandard(
    contractAddress: string,
    accountId: string,
    receiverId: string,
    transferContractAddress?: string
) {
  if (!contractAddress || !accountId || !receiverId) {
    console.log(
        chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID RECEIVER_ID}`
    );
    return;
}
  
    // assumptions:
    //   -accountId is the owner in the ft contract, meaning token supply has been allocated to it
    //   -receiverId is registered in the ft contract


    // run serially since calls may rely on previous calls
    await ftTotalSupplyInvoke(contractAddress);
    await ftMetadataInvoke(contractAddress);

    // check balances before transfer
    await ftBalanceOfInvoke(contractAddress, accountId);
    await ftBalanceOfInvoke(contractAddress, receiverId);

    // transfer
    await ftTransferInvoke(contractAddress, accountId, receiverId);

    // check balances after transfer
    await ftBalanceOfInvoke(contractAddress, accountId);
    await ftBalanceOfInvoke(contractAddress, receiverId);

    if (transferContractAddress) {
      await ftBalanceOfInvoke(contractAddress, transferContractAddress);
      await ftTransferCallInvoke(contractAddress, accountId, transferContractAddress);
      await ftBalanceOfInvoke(contractAddress, transferContractAddress);
    } else {
      console.log(chalk`{white skipping ftTransferCallInvoke since no transfer contract address was provided}`);
    }
}

export async function ftTotalSupplyInvoke(contractAddress: string) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await ftTotalSupply({
        args: undefined,
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white ft_total_supply}
{white ------------------------------------------------------------------------ }
{bold.white Total Supply} {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function ftBalanceOfInvoke(
    contractAddress: string,
    accountId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await ftBalanceOf({
        args: {
            account_id: accountId,
        },
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white ft_balance_of}
{white ------------------------------------------------------------------------ }
{bold.white Balance of ${accountId}} {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function ftMetadataInvoke(contractAddress: string) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await ftMetadata({
        args: undefined,
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white ft_metadata}
{white ------------------------------------------------------------------------ }
{bold.white Metadata}     {white |} {bold.yellow ${JSON.stringify(result)}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function ftTransferInvoke(
    contractAddress: string,
    accountId: string,
    receiverId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { outcome } = await ftTransfer({
        receiver: contractAddress,
        sender: accountId,
        args: {
            receiver_id: receiverId,
            amount: 100n,
        },
        deps: {
            rpcProvider,
            signer,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white ft_transfer}
{white ------------------------------------------------------------------------ }
{bold.white Transaction Hash} {white |} {bold.yellow ${outcome.transaction.hash}}
{bold.white Gas Burnt}        {white |} {bold.yellow ${outcome.transaction_outcome.outcome.gas_burnt}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function ftTransferCallInvoke(
    contractAddress: string,
    accountId: string,
    receiverId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { outcome, result } = await ftTransferCall({
        receiver: contractAddress,
        sender: accountId,
        args: {
            receiver_id: receiverId,
            amount: 5n,
            msg: "take-my-money", // defined in the receiver contract, keeps the tokens
            memo: null,

        },
        deps: {
            rpcProvider,
            signer,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white ft_transfer_call}
{white ------------------------------------------------------------------------ }
{bold.white Transaction Hash} {white |} {bold.yellow ${outcome.transaction.hash}}
{bold.white Gas Burnt}        {white |} {bold.yellow ${outcome.transaction_outcome.outcome.gas_burnt}}
{bold.white Result}           {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}