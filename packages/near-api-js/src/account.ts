import { Provider } from "@near-js/providers";
import { SignerV2 } from "./signer";
import {
    Action,
    createTransaction,
    SignedTransaction,
    Transaction,
} from "@near-js/transactions";
import {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    transfer,
} from "./transaction";
import {
    AccessKeyList,
    AccessKeyView,
    AccessKeyViewRaw,
    AccountView,
    BlockHash,
    CodeResult,
    ContractCodeView,
    FinalExecutionOutcome,
    ViewStateResult,
} from "@near-js/types";
import { PublicKey } from "@near-js/crypto";
import { baseDecode } from "@near-js/utils";

export {
    Account,
    AccountBalance,
    AccountAuthorizedApp,
    SignAndSendTransactionOptions,
    FunctionCallOptions,
    ChangeFunctionCallOptions,
    ViewFunctionCallOptions,
} from "@near-js/accounts";

export class PublicAccountV2 {
    public readonly accountId: string;
    public readonly provider: Provider;

    constructor(accountId: string, provider: Provider) {
        this.accountId = accountId;
        this.provider = provider;
    }

    public intoSignerAccount(signer: SignerV2): SignerAccountV2 {
        return new SignerAccountV2(this.accountId, this.provider, signer);
    }

    public intoContract(): ContractV2 {
        return new ContractV2(this.accountId, this.provider);
    }

    public async getInformation(): Promise<AccountView> {
        return this.provider.query<AccountView>({
            request_type: "view_account",
            account_id: this.accountId,
            finality: "optimistic",
        });
    }

    public async getAccessKey(pk: PublicKey): Promise<AccessKeyView> {
        return this.provider.query<AccessKeyView>({
            request_type: "view_access_key",
            public_key: pk.toString(),
            account_id: this.accountId,
            finality: "optimistic",
        });
    }

    public async getAccessKeys(): Promise<AccessKeyList> {
        return this.provider.query<AccessKeyList>({
            request_type: "view_access_key_list",
            account_id: this.accountId,
            finality: "optimistic",
        });
    }

    public async getTransactionStatus(
        txHash: string
    ): Promise<FinalExecutionOutcome> {
        return this.provider.txStatus(
            txHash,
            this.accountId,
            "EXECUTED_OPTIMISTIC"
        );
    }
}

export class ContractV2 extends PublicAccountV2 {
    constructor(accountId: string, provider: Provider) {
        super(accountId, provider);
    }

    public async getCode(): Promise<ContractCodeView> {
        return this.provider.query<ContractCodeView>({
            request_type: "view_code",
            account_id: this.accountId,
            finality: "optimistic",
        });
    }

    public async getState(prefix: string = ""): Promise<ViewStateResult> {
        const prefixBase64 = Buffer.from(prefix).toString("base64");

        return this.provider.query<ViewStateResult>({
            request_type: "view_state",
            account_id: this.accountId,
            finality: "optimistic",
            prefix_base64: prefixBase64,
        });
    }

    public async callReadFunction(
        methodName: string,
        args: Record<string, any> = {}
    ): Promise<CodeResult> {
        const argsBase64 = Buffer.from(JSON.stringify(args)).toString("base64");

        return this.provider.query<CodeResult>({
            request_type: "call_function",
            account_id: this.accountId,
            method_name: methodName,
            args_base64: argsBase64,
            finality: "optimistic",
        });
    }

    public async callWriteFunction(
        signerAccount: SignerAccountV2,
        methodName: string,
        args: Record<string, any> = {},
        deposit: bigint = 0n,
        gas: bigint = 30_000_000_000_000n
    ): Promise<FinalExecutionOutcome> {
        const actions = [functionCall(methodName, args, gas, deposit)];

        const transaction = await signerAccount.constructTransaction(
            this.accountId,
            actions
        );

        return signerAccount.signAndSendTransaction(transaction);
    }
}

// PublicAccount

// Wallet -> accountId, signer, provider
// Signer -> signNep413Message, signTransaction

export class SignerAccountV2 extends PublicAccountV2 {
    public signer: SignerV2;

    constructor(accountId: string, provider: Provider, signer: SignerV2) {
        super(accountId, provider);
        this.signer = signer;
    }

    public intoDelegateAccount(): any {
        throw new Error(`Not implemented yet!`);
    }

    public setSigner(signer: SignerV2): void {
        this.signer = signer;
    }

    public async constructTransaction(
        receiverId: string,
        actions: Array<Action>
    ): Promise<Transaction> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const block = await this.provider.block({ finality: "final" });
        const recentBlockHash = block.header.hash;

        const publicKey = this.signer.getPublicKey();

        // get the nonce for the public key for this account
        const nonce = this.provider.getNonce(this.accountId, publicKey);

        return createTransaction(
            this.accountId,
            publicKey,
            receiverId,
            nonce + 1n,
            actions,
            baseDecode(recentBlockHash)
        );
    }

    // Actions
    public async createSubAccount(
        name: string,
        pk: PublicKey,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const accountName = `${name}.${this.accountId}`;

        const actions = [
            createAccount(),
            transfer(amount),
            addKey(pk, fullAccessKey()),
        ];

        const transaction = await this.constructTransaction(
            accountName,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }

    public async deleteAccount(
        beneficiaryId: string
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [deleteAccount(beneficiaryId)];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }

    public async addFullAccessKey(
        pk: PublicKey
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [addKey(pk, fullAccessKey())];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }

    public async addFunctionAccessKey(
        pk: PublicKey,
        receiverId: string,
        methodNames: string[],
        allowance?: bigint
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [
            addKey(
                pk,
                functionCallAccessKey(receiverId, methodNames, allowance)
            ),
        ];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }
    public async deleteKey(pk: PublicKey): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [deleteKey(pk)];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }

    public async transfer(
        receiverId: string,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [transfer(amount)];

        const transaction = await this.constructTransaction(
            receiverId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }
    public async deployContract(
        code: Uint8Array
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [deployContract(code)];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signAndSendTransaction(transaction);
    }

    public async signTransaction(
        transaction: Transaction
    ): Promise<SignedTransaction> {
        return this.signer.signTransaction(transaction);
    }

    public async signAndSendTransaction(
        transaction: Transaction | { receiverId: string; actions: Array<Action> }
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(transaction);
    }


    // public async signAndSendTransaction({
    //     receiverId: string,
    //     actions: Array<Action>
    // }): Promise<FinalExecutionOutcome> {
    // }

    // public async signAndSendTransactions(
    //      transactions: Array<Transaction>,
    // ): Promise<FinalExecutionOutcome> {
    // }

    // public async signAndSendTransactions(
    //      transactions: Array<{receiverId: string, actions: Array<Action>}>,
    // ): Promise<FinalExecutionOutcome> {
    // }
}
