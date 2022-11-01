import BN from 'bn.js';

import { FunctionCallOptions } from './account';
import { DEFAULT_FUNCTION_CALL_GAS } from './constants';
import { FinalExecutionOutcome } from './providers/provider';
import {
    AccessKey,
    Action,
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    SignedTransaction,
    stake,
    transfer,
} from './transaction';
import { TransactionSender } from './transaction_sender';
import { PublicKey } from './utils';

type TransactionBuilderConfig = {
    receiverId: string;
    sender: TransactionSender;
    senderId: string;
}

/**
 * Transaction Builder class. Initialized to an account that will sign the final transaction
 */
export class TransactionBuilder {
    readonly receiverId: string;
    readonly senderId: string;
    readonly sender: TransactionSender;
    readonly actions: Action[];

    constructor({ sender, senderId, receiverId }: TransactionBuilderConfig) {
        this.receiverId = receiverId;
        this.senderId = senderId;
        this.sender = sender;

        this.actions = [];
    }

    addKey(publicKey: string | PublicKey, accessKey: AccessKey = fullAccessKey()): this {
        this.addAction(addKey(PublicKey.from(publicKey), accessKey));
        return this;
    }

    createAccount(): this {
        this.addAction(createAccount());
        return this;
    }

    deleteAccount(beneficiaryId: string): this {
        this.addAction(deleteAccount(beneficiaryId));
        return this;
    }

    deleteKey(publicKey: string | PublicKey): this {
        this.addAction(deleteKey(PublicKey.from(publicKey)));
        return this;
    }

    deployContract(code: Uint8Array | Buffer): this {
        this.addAction(deployContract(code));
        return this;
    }

    functionCall({ methodName, args = {}, gas = DEFAULT_FUNCTION_CALL_GAS, attachedDeposit, stringify }: Omit<FunctionCallOptions, 'contractId' | 'jsContract'>): this {
        this.addAction(
            functionCall(methodName, args, gas, attachedDeposit, stringify),
        );
        return this;
    }

    stake(amount: BN, publicKey: PublicKey | string): this {
        this.addAction(stake(amount, PublicKey.from(publicKey)));
        return this;
    }

    transfer(amount: BN): this {
        this.addAction(transfer(amount));
        return this;
    }

    addAction(action: Action): this {
        this.actions.push(action);
        return this;
    }

    async signAndSend(): Promise<FinalExecutionOutcome> {
        return this.sender.signAndSendTransaction({
            signerId: this.senderId,
            receiverId: this.receiverId,
            actions: this.actions,
        });
    }

    async sign(): Promise<[Uint8Array, SignedTransaction]> {
        return this.sender.signTransaction({
            signerId: this.senderId,
            receiverId: this.receiverId,
            actions: this.actions,
        });
    }
}