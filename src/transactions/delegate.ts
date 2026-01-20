import type { PublicKey } from '../crypto/index.js';

import { Actions } from './action_creators.js';
import { Action, AddKey } from './actions.js';

const {
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    functionCall,
    stake,
    transfer,
    deployGlobalContract,
    useGlobalContract,
} = Actions;

export class DelegateAction {
    senderId: string;
    receiverId: string;
    actions: Array<Action>;
    nonce: bigint;
    maxBlockHeight: bigint;
    publicKey: PublicKey;

    constructor({
        senderId,
        receiverId,
        actions,
        nonce,
        maxBlockHeight,
        publicKey,
    }: {
        senderId: string;
        receiverId: string;
        actions: Action[];
        nonce: bigint;
        maxBlockHeight: bigint;
        publicKey: PublicKey;
    }) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.actions = actions;
        this.nonce = nonce;
        this.maxBlockHeight = maxBlockHeight;
        this.publicKey = publicKey;
    }
}

/**
 * Compose a delegate action for inclusion with a meta transaction signed on the sender's behalf
 * @param actions The set of actions to be included in the meta transaction
 * @param maxBlockHeight The maximum block height for which this action can be executed as part of a transaction
 * @param nonce Current nonce on the access key used to sign the delegate action
 * @param publicKey Public key for the access key used to sign the delegate action
 * @param receiverId Account ID for the intended receiver of the meta transaction
 * @param senderId Account ID for the intended signer of the delegate action
 */
export function buildDelegateAction({
    actions,
    maxBlockHeight,
    nonce,
    publicKey,
    receiverId,
    senderId,
}: DelegateAction): DelegateAction {
    return new DelegateAction({
        senderId,
        receiverId,
        actions: actions.map((a) => {
            // @ts-expect-error type workaround
            if (!a.type && !a.params) {
                return a;
            }

            // @ts-expect-error type workaround
            switch (a.type) {
                case 'AddKey': {
                    // @ts-expect-error type workaround
                    const { publicKey, accessKey } = a.params;
                    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
                }
                case 'CreateAccount': {
                    // @ts-expect-error type workaround
                    return createAccount(a.params.createAccount);
                }
                case 'DeleteAccount': {
                    // @ts-expect-error type workaround
                    return deleteAccount(a.params.deleteAccount);
                }
                case 'DeleteKey': {
                    // @ts-expect-error type workaround
                    return deleteKey(a.params.publicKey);
                }
                case 'DeployContract': {
                    // @ts-expect-error type workaround
                    return deployContract(a.params.code);
                }
                case 'FunctionCall': {
                    // @ts-expect-error type workaround
                    const { methodName, args, gas, deposit } = a.params;
                    return functionCall(methodName, args, gas, deposit);
                }
                case 'Stake': {
                    // @ts-expect-error type workaround
                    return stake(a.params.stake, a.params.publicKey);
                }
                case 'Transfer': {
                    // @ts-expect-error type workaround
                    const { deposit } = a.params;
                    return transfer(deposit);
                }
                case 'DeployGlobalContract': {
                    // @ts-expect-error type workaround
                    const { code, deployMode } = a.params;
                    // Ensure deployMode is an instance if passed as a plain object
                    const modeInstance = 'CodeHash' in deployMode ? 'codeHash' : 'accountId';
                    return deployGlobalContract(code, modeInstance);
                }
                case 'UseGlobalContract': {
                    // @ts-expect-error type workaround
                    const { identifier } = a.params;
                    // Ensure identifier is an instance if passed as a plain object
                    const idInstance =
                        'CodeHash' in identifier
                            ? { codeHash: identifier.CodeHash }
                            : { accountId: identifier.AccountId };
                    return useGlobalContract(idInstance);
                }
            }

            throw new Error('Unrecognized action');
        }),
        nonce,
        maxBlockHeight,
        publicKey,
    });
}
