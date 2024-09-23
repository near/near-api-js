/**
 * This serves both as a demo of interfacing with a Non-Fungible Token Standard
 * contract and a basic test of the client library
 * 
 * ! NOTE: These examples may not work with a JS/TS contract since near-sdk-js
 * !       has some type differences from the NEP standards, see comments in
 * !       @near-js/client/src/contract-standards/non-fungible-token.ts
 * 
 * Tested against near-sdk-rs example NFT contract:
 * https://github.com/near/near-sdk-rs/tree/master/examples/non-fungible-token
 * 
 * Reproduction steps:
 * - create three test accounts: hereafter referred to as CONTRACT_ID, ACCOUNT_ID, RECEIVER_ID
 * - clone and build contract
 * - deploy with init call
 *   - `near contract deploy <CONTRACT_ID> use-file res/non_fungible_token.wasm with-init-call new_default_meta json-args '{"owner_id":"<ACCOUNT_ID>","total_supply":"10000"}' prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`
 * - mint two tokens to ACCOUNT_ID (note that ACCOUNT_ID must be the owner of the contract set during the init call in order to mint tokens)
 *   - `near contract call-function as-transaction <CONTRACT_ID> nft_mint json-args '{"token_id": "1","token_owner_id": "<ACCOUNT_ID>","token_metadata": {"title":"One","description":"One"}}' prepaid-gas '100.0 Tgas' attached-deposit '0.5 NEAR' sign-as <ACCOUNT_ID> network-config testnet sign-with-keychain send`
 *   - `near contract call-function as-transaction <CONTRACT_ID> nft_mint json-args '{"token_id": "2","token_owner_id": "<ACCOUNT_ID>","token_metadata": {"title":"Two","description":"Two"}}' prepaid-gas '100.0 Tgas' attached-deposit '0.5 NEAR' sign-as <ACCOUNT_ID> network-config testnet sign-with-keychain send`
 * - run this script
 *   - `pnpm nonFungibleTokenStandard -- <CONTRACT_ID> <ACCOUNT_ID> <RECEIVER_ID>`
 */

import {
    getSignerFromKeystore,
    getTestnetRpcProvider,
    nftTransfer,
    // nftTransferCall,
    nftToken,
    nftTotalSupply,
    nftSupplyForOwner,
    nftTokens,
    nftTokensForOwner,
    nftMetadata,
} from "@near-js/client";
import { UnencryptedFileSystemKeyStore } from "@near-js/keystores-node";
import chalk from "chalk";
import { join } from "node:path";
import { homedir } from "node:os";

export default async function nonFungibleTokenStandard(
    contractAddress: string,
    accountId: string,
    receiverId: string
) {
  if (!contractAddress || !accountId || !receiverId) {
    console.log(
        chalk`{red pnpm nonFungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID RECEIVER_ID}`
    );
    return;
}

    // assumptions
    // - token ID "1" exists
    // - token ID "1" is owned by accountId
    // - both accountId and receiverId are registered with the contract
    // - token ID "2" exists
    // - token ID "2" is owned by accountId
    // run serially since calls may rely on previous calls
    await nftTotalSupplyInvoke(contractAddress);
    await nftMetadataInvoke(contractAddress);
    await nftTokensInvoke(contractAddress);

    // check token ownership before transfer
    await nftTokenInvoke(contractAddress, "1"); // Assuming token ID "1" exists
    await nftSupplyForOwnerInvoke(contractAddress, accountId);
    await nftTokensForOwnerInvoke(contractAddress, accountId);

    // transfer
    await nftTransferInvoke(contractAddress, accountId, receiverId, "1");

    // check token ownership after transfer
    await nftTokenInvoke(contractAddress, "1");
    await nftSupplyForOwnerInvoke(contractAddress, receiverId);
    await nftTokensForOwnerInvoke(contractAddress, receiverId);
    
    // transfer back to original owner
    await nftTransferInvoke(contractAddress, receiverId, accountId, "1");
    await nftTokenInvoke(contractAddress, "1");

    // from_index examples, skips first token and returns only one token
    await nftTokensForOwnerInvoke(contractAddress, accountId, 1n, 1);
    await nftTokensInvoke(contractAddress, 1n, 1);

    // TODO: Implement nftTransferCallInvoke once we have a contract that supports it
    // await nftTransferCallInvoke(contractAddress, accountId, receiverId, "2");
}

export async function nftTotalSupplyInvoke(contractAddress: string) {
    if (!contractAddress) {
        console.log(
            chalk`{red pnpm nonFungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID RECEIVER_ID}`
        );
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftTotalSupply({
        args: undefined,
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_total_supply}
{white ------------------------------------------------------------------------ }
{bold.white Total Supply} {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftTokenInvoke(
    contractAddress: string,
    tokenId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftToken({
        args: {
            token_id: tokenId,
        },
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_token}
{white ------------------------------------------------------------------------ }
{bold.white Token ID}    {white |} {bold.yellow ${result.token_id}}
{bold.white Owner ID}    {white |} {bold.yellow ${result.owner_id}}
{bold.white Metadata}    {white |} {bold.yellow ${JSON.stringify(result.metadata)}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftMetadataInvoke(contractAddress: string) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftMetadata({
        args: undefined,
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_metadata}
{white ------------------------------------------------------------------------ }
{bold.white Metadata}     {white |} {bold.yellow ${JSON.stringify(result)}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftTransferInvoke(
    contractAddress: string,
    accountId: string,
    receiverId: string,
    tokenId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
    const signer = getSignerFromKeystore(
        accountId,
        "testnet",
        new UnencryptedFileSystemKeyStore(join(homedir(), ".near-credentials"))
    );

    const { outcome } = await nftTransfer({
        receiver: contractAddress,
        sender: accountId,
        args: {
            receiver_id: receiverId,
            token_id: tokenId,
        },
        deps: {
            rpcProvider,
            signer,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_transfer}
{white ------------------------------------------------------------------------ }
{bold.white Transaction Hash} {white |} {bold.yellow ${outcome.transaction.hash}}
{bold.white Gas Burnt}        {white |} {bold.yellow ${outcome.transaction_outcome.outcome.gas_burnt}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftSupplyForOwnerInvoke(
    contractAddress: string,
    accountId: string
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftSupplyForOwner({
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
{bold.green RESULTS} {white nft_supply_for_owner}
{white ------------------------------------------------------------------------ }
{bold.white Supply for ${accountId}} {white |} {bold.yellow ${result}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftTokensInvoke(
    contractAddress: string,
    fromIndex?: bigint,
    limit?: number
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftTokens({
        args: {
            from_index: fromIndex ?? null,
            limit: limit,
        },
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_tokens}
{white ------------------------------------------------------------------------ }
{bold.white Tokens}     {white |} {bold.yellow ${JSON.stringify(result, null, 2)}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

export async function nftTokensForOwnerInvoke(
    contractAddress: string,
    accountId: string,
    fromIndex?: bigint,
    limit?: number
) {
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();

    const result = await nftTokensForOwner({
        args: {
            account_id: accountId,
            from_index: fromIndex ?? null,
            limit: limit,
        },
        account: contractAddress,
        deps: {
            rpcProvider,
        },
    });

    const output = chalk`
{white ------------------------------------------------------------------------ }
{bold.green RESULTS} {white nft_tokens_for_owner}
{white ------------------------------------------------------------------------ }
{bold.white Tokens for ${accountId}}     {white |} {bold.yellow ${JSON.stringify(result, null, 2)}}
{white ------------------------------------------------------------------------ }
  `;
    console.log(output);
}

