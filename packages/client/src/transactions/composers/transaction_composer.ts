import { PublicKey } from '@near-js/crypto';
import {
    type Action,
    actionCreators,
    type DelegateAction,
    type Signature,
    Transaction,
} from '@near-js/transactions';
import type { BlockHash } from '@near-js/types';
import { baseDecode, DEFAULT_FUNCTION_CALL_GAS } from '@near-js/utils';
import type { TransactionOptions } from '../../interfaces/index.js';

export class TransactionComposer {
    protected actions: Action[] = [];
    receiver: string | undefined;
    sender: string | undefined;
    blockHash: BlockHash | undefined;
    nonce: bigint | undefined;
    publicKey: PublicKey | undefined;

    constructor(transaction: TransactionOptions) {
        this.receiver = transaction.receiver;
        this.sender = transaction.sender;
        this.blockHash = transaction.blockHash;
        this.nonce = transaction.nonce;
        this.publicKey = transaction.publicKey;
    }

    /**
     * Initialize the composer
     * @param transaction composer configuration
     */
    static init(transaction: TransactionOptions) {
        return new TransactionComposer(transaction);
    }

    /**
     * Validate and return the object used for Transaction instantiation
     * @param transaction transaction values to override composed transaction fields
     * @private
     */
    private buildTransactionObject(transaction?: TransactionOptions) {
        const tx = {
            actions: this.actions,
            blockHash: baseDecode(transaction?.blockHash || this.blockHash),
            nonce: transaction?.nonce || this.nonce,
            publicKey: transaction?.publicKey || this.publicKey,
            receiverId: transaction?.receiver || this.receiver,
            signerId: transaction?.sender || this.sender,
        };

        if (
            !tx.actions.length ||
            !tx.blockHash ||
            !tx.nonce ||
            !tx.publicKey ||
            !tx.receiverId ||
            !tx.signerId
        ) {
            throw new Error(`invalid transaction: ${JSON.stringify(tx)}`);
        }

        return tx;
    }

    /**
     * Return a Transaction instance from the composed transaction
     * @param transaction transaction configuration to override values set at composer initialization
     */
    toTransaction(transaction?: TransactionOptions): Transaction {
        return new Transaction(this.buildTransactionObject(transaction));
    }

    /**
     * Add an action to add a full access key
     * @param publicKey string representation of the public key on the new access key
     */
    addFullAccessKey(publicKey: string): this {
        this.actions.push(
            actionCreators.addKey(
                PublicKey.from(publicKey),
                actionCreators.fullAccessKey(),
            ),
        );
        return this;
    }

    /**
     * Add an action to create a function call access key
     * @param publicKey string representation of the public key on the new access key
     * @param contractId permitted contract
     * @param methodNames set of permitted methods
     * @param allowance max allowable balance attached to transactions signed with this key
     */
    addFunctionCallAccessKey(
        publicKey: string,
        contractId: string,
        methodNames: string[],
        allowance?: bigint,
    ): this {
        const accessKey = actionCreators.functionCallAccessKey(
            contractId,
            methodNames,
            allowance,
        );
        this.actions.push(
            actionCreators.addKey(PublicKey.from(publicKey), accessKey),
        );
        return this;
    }

    /**
     * Add an action to create a sub-account for the transaction recipient
     */
    createAccount(): this {
        this.actions.push(actionCreators.createAccount());
        return this;
    }

    /**
     * Add an action to delete the account signing the composed transaction
     * @param beneficiaryId designated recipient account for any remaining balance on the deleted account
     */
    deleteAccount(beneficiaryId: string): this {
        this.actions.push(actionCreators.deleteAccount(beneficiaryId));
        return this;
    }

    /**
     * Add an action to delete the specified access key
     * @param publicKey string representation of the public key on the access key to be deleted
     */
    deleteKey(publicKey: string): this {
        this.actions.push(actionCreators.deleteKey(PublicKey.from(publicKey)));
        return this;
    }

    /**
     * Add an action to deploy code to a contract
     * @param code compiled smart contract binary
     */
    deployContract(code: Uint8Array): this {
        this.actions.push(actionCreators.deployContract(code));
        return this;
    }

    /**
     * Add an action to invoke a smart contract method
     * @param method name of the method to be executed
     * @param args named arguments to the invocation
     * @param gas amount of gas (in yN) included to cover execution cost
     * @param deposit amount of Near (in yN) to attach to the invocation
     */
    functionCall(
        method: string,
        args: object,
        gas: bigint = DEFAULT_FUNCTION_CALL_GAS * BigInt(10),
        deposit = BigInt(0),
    ): this {
        this.actions.push(
            actionCreators.functionCall(method, args, gas, deposit),
        );
        return this;
    }

    /**
     * Add an action wrapping a delegate action for inclusion in meta transaction
     * @param delegateAction delegate action encapsulating the set of actions to be executed on the requesting account's behalf
     * @param signature signature of the delegate action signed by the requesting account
     */
    signedDelegate(delegateAction: DelegateAction, signature: Signature): this {
        this.actions.push(
            actionCreators.signedDelegate({ delegateAction, signature }),
        );
        return this;
    }

    /**
     * Add an action to stake Near with a validator
     * @param stake amount of Near (in yN) to stake
     * @param publicKey string representation of the validator's key
     */
    stake(stake: bigint, publicKey: string): this {
        this.actions.push(
            actionCreators.stake(stake, PublicKey.from(publicKey)),
        );
        return this;
    }

    /**
     * Add an action to transfer Near to another account
     * @param deposit amount of Near (in yN) to transfer
     */
    transfer(deposit: bigint): this {
        this.actions.push(actionCreators.transfer(deposit));
        return this;
    }
}
