import BN from 'bn.js';
import { Connection } from './connection';
import { DEFAULT_FUNCTION_CALL_GAS, ZERO_NEAR } from './constants';
import { AccessKeyView, FinalExecutionOutcome } from './providers/provider';
import { AccessKey, Action, addKey, createAccount, deleteAccount, deleteKey, deployContract, fullAccessKey, functionCall, SignedTransaction, stake, transfer } from './transaction';
import { TransactionSender } from './transaction_sender';
import { PublicKey } from './utils';

/**
 * Transaction Builder class. Initialized to an account that will sign the final transaction
 */
export class TransactionBuilder extends TransactionSender {
    readonly receiverId: string;
    readonly senderId: string;
    readonly connection: Connection;

    readonly actions: Action[];
    accessKeyByPublicKeyCache: { [key: string]: AccessKeyView };

    constructor(connection: Connection, senderId: string, receiverId: string) {
        super(connection, senderId);
        this.receiverId = receiverId;
        this.connection = connection;
        this.senderId = senderId;
        this.actions = [];
        this.accessKeyByPublicKeyCache = {};
    }

    addKey(publicKey: string | PublicKey, accessKey: AccessKey = fullAccessKey()): this {
        this.actions.push(addKey(PublicKey.from(publicKey), accessKey));
        return this;
    }

    createAccount(): this {
        this.actions.push(createAccount());
        return this;
    }

    deleteAccount(beneficiaryId: string): this {
        this.actions.push(deleteAccount(beneficiaryId));
        return this;
    }

    deleteKey(publicKey: string | PublicKey): this {
        this.actions.push(deleteKey(PublicKey.from(publicKey)));
        return this;
    }

    deployContract(code: Uint8Array | Buffer): this {
        this.actions.push(deployContract(code));
        return this;
    }

    functionCall(
        methodName: string,
        args: Record<string, unknown> | Uint8Array,
        {
            gas = DEFAULT_FUNCTION_CALL_GAS,
            attachedDeposit = ZERO_NEAR,
        }: { gas?: BN; attachedDeposit?: BN } = {},
    ): this {
        this.actions.push(
            functionCall(methodName, args, gas, attachedDeposit),
        );
        return this;
    }

    stake(amount: BN, publicKey: PublicKey | string): this {
        this.actions.push(stake(amount, PublicKey.from(publicKey)));
        return this;
    }

    transfer(amount: BN): this {
        this.actions.push(transfer(amount));
        return this;
    }

    push(action: Action): this {
        this.actions.push(action);
        return this;
    }

    async signAndSend(): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({ receiverId: this.receiverId, actions: this.actions });
    }

    async sign(): Promise<[Uint8Array, SignedTransaction]> {
        return this.signTransaction(this.receiverId, this.actions);
    }
}