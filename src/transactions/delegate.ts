import type { PublicKey } from '../crypto/index.js';
import type { Action } from './actions.js';

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
