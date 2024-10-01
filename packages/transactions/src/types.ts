import { PublicKey } from '@near-js/crypto';

// We use this to avoid circular dependencies
// when importing the Action class directly
export interface ActionType {
  enum: string;
}

export interface IDelegateAction {
  senderId: string;
  receiverId: string;
  actions: Array<ActionType>;
  nonce: bigint;
  maxBlockHeight: bigint;
  publicKey: PublicKey;
}
