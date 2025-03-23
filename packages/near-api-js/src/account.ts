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

export class SignerAccountV2 extends PublicAccountV2 {
    public readonly signer: SignerV2;

    constructor(accountId: string, provider: Provider, signer: SignerV2) {
        super(accountId, provider);

        this.signer = signer;
    }

    public intoDelegateAccount(): any {
        throw new Error(`Not implemented yet!`);
    }

    // TODO: Find matching access key based on transaction (i.e. receiverId and actions)
    protected async matchAccessKeyBasedOnReceiverAndActions(
        publicKeys: Array<PublicKey>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        receiverId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        actions: Array<Action>
    ): Promise<{ publicKey: PublicKey; accessKey: AccessKeyView } | undefined> {
        const pk = publicKeys.at(0)!;

        const rawAccessKey = await this.provider.query<AccessKeyViewRaw>({
            request_type: "view_access_key",
            account_id: this.accountId,
            public_key: pk.toString(),
            finality: "optimistic",
        });

        // store nonce as BigInt to preserve precision on big number
        const accessKey = {
            ...rawAccessKey,
            nonce: BigInt(rawAccessKey.nonce || 0),
        };

        return { publicKey: pk, accessKey };
    }

    protected async findRecentBlockHash(): Promise<BlockHash> {
        const block = await this.provider.block({ finality: "final" });
        return block.header.hash;
    }

    public async constructTransaction(
        receiverId: string,
        actions: Array<Action>
    ): Promise<Transaction> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const publicKeys = await this.signer.getPublicKeys();

        if (publicKeys.length === 0)
            throw new Error(`No public keys available!`);

        const signerKey = await this.matchAccessKeyBasedOnReceiverAndActions(
            publicKeys,
            receiverId,
            actions
        );

        if (!signerKey) throw new Error(`No public key found`);

        const recentBlockHash = await this.findRecentBlockHash();

        return createTransaction(
            this.accountId,
            signerKey.publicKey,
            receiverId,
            signerKey.accessKey.nonce + 1n,
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
    }
    public async deleteKey(pk: PublicKey): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        const actions = [deleteKey(pk)];

        const transaction = await this.constructTransaction(
            this.accountId,
            actions
        );

        return this.signer.signAndSendTransaction(transaction, this.provider);
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
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

        return this.signer.signAndSendTransaction(transaction, this.provider);
    }

    public async signTransaction(
        transaction: Transaction
    ): Promise<SignedTransaction> {
        if (!this.signer) throw new Error(`Signer is required!`);

        return this.signer.signTransaction(transaction);
    }

    public async signAndSendTransaction(
        transaction: Transaction
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error(`Signer is required!`);

        return this.signer.signAndSendTransaction(transaction, this.provider);
    }
}
