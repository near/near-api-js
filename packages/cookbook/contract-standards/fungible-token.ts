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
    receiverId: string
) {
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

    // TODO transfer call once we have a contract that supports it
    // await ftTransferCallInvoke(contractAddress, accountId);
    // await ftBalanceOfInvoke(contractAddress, accountId);
}

export async function ftTotalSupplyInvoke(contractAddress: string) {
    if (!contractAddress) {
        console.log(
            chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

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
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

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
    if (!contractAddress) {
        console.log(
            chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
        );
        return;
    }

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
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
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
    accountId: string
) {
    if (!contractAddress || !accountId) {
        console.log(
            chalk`{red pnpm fungibleTokenStandard -- CONTRACT_ADDRESS ACCOUNT_ID}`
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

    const { outcome, result } = await ftTransferCall({
        receiver: contractAddress,
        sender: accountId,
        args: {
            receiver_id: "example.testnet",
            amount: 1000000000000000000000000n, // 1 TOKEN
            msg: "Example transfer call",
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
