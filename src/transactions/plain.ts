import { curveFromKey, keyFromString } from '../crypto/utils.js';
import { base64Decode, baseDecode } from '../utils/format.js';

/**
 * A plain JSON-friendly transaction object that can be easily constructed
 * without needing to import classes. Use {@link mapTransaction} to convert
 * to a borsh-serializable format compatible with {@link SCHEMA}.
 */
export interface PlainTransaction {
    signerId: string;
    publicKey: string;
    nonce: string | bigint | number;
    receiverId: string;
    blockHash: string;
    actions: PlainAction[];
}

export interface PlainSignedTransaction {
    transaction: object;
    signature: object;
}

export type PlainAction =
    | { type: 'CreateAccount' }
    | { type: 'DeployContract'; codeBase64: string }
    | {
          type: 'FunctionCall';
          methodName: string;
          args?: object;
          argsBase64?: string;
          gas?: string | number;
          deposit?: string | number;
      }
    | { type: 'Transfer'; deposit: string | number }
    | { type: 'Stake'; stake: string | number; publicKey: string }
    | { type: 'AddKey'; publicKey: string; accessKey: PlainAccessKey }
    | { type: 'DeleteKey'; publicKey: string }
    | { type: 'DeleteAccount'; beneficiaryId: string }
    | { type: 'SignedDelegate'; delegateAction: PlainAction; signature: string; publicKey: string };

export interface PlainAccessKey {
    nonce: string | bigint | number;
    permission:
        | 'FullAccess'
        | {
              receiverId: string;
              methodNames: string[];
              allowance?: string | number | null;
          };
}

function mapPublicKey(keyString: string) {
    const curve = curveFromKey(keyString);
    const data = keyFromString(keyString);
    return curve === 'secp256k1' ? { secp256k1Key: { data } } : { ed25519Key: { data } };
}

function mapSignature(sigBase58: string, signerKeyString: string) {
    const curve = curveFromKey(signerKeyString);
    const data = baseDecode(sigBase58);
    return curve === 'secp256k1' ? { secp256k1Signature: { data } } : { ed25519Signature: { data } };
}

/**
 * Convert a {@link PlainTransaction} (plain JSON object) into a borsh-serializable
 * object matching the transaction SCHEMA. Use with `serialize(SCHEMA.Transaction, ...)`.
 */
export function mapTransaction(jsonTransaction: PlainTransaction) {
    return {
        signerId: jsonTransaction.signerId,
        publicKey: mapPublicKey(jsonTransaction.publicKey),
        nonce: BigInt(jsonTransaction.nonce),
        receiverId: jsonTransaction.receiverId,
        blockHash: baseDecode(jsonTransaction.blockHash),
        actions: jsonTransaction.actions.map(mapAction),
    };
}

/**
 * Convert a {@link PlainTransaction} and base58 signature into a borsh-serializable
 * signed transaction object matching SCHEMA.SignedTransaction.
 */
export function mapSignedTransaction(jsonTransaction: PlainTransaction, signature: string): PlainSignedTransaction {
    return {
        transaction: mapTransaction(jsonTransaction),
        signature: mapSignature(signature, jsonTransaction.publicKey),
    };
}

const textEncoder = new TextEncoder();

/**
 * Convert a plain action object (with `type` discriminator) into the borsh-serializable
 * format expected by the transaction SCHEMA.
 */
export function mapAction(action: PlainAction): object {
    switch (action.type) {
        case 'CreateAccount':
            return { createAccount: {} };
        case 'DeployContract':
            return { deployContract: { code: base64Decode(action.codeBase64) } };
        case 'FunctionCall':
            return {
                functionCall: {
                    methodName: action.methodName,
                    args:
                        action.argsBase64 != null
                            ? base64Decode(action.argsBase64)
                            : textEncoder.encode(JSON.stringify(action.args)),
                    gas: BigInt(action.gas ?? '300000000000000'),
                    deposit: BigInt(action.deposit ?? '0'),
                },
            };
        case 'Transfer':
            return { transfer: { deposit: BigInt(action.deposit) } };
        case 'Stake':
            return {
                stake: {
                    stake: BigInt(action.stake),
                    publicKey: mapPublicKey(action.publicKey),
                },
            };
        case 'AddKey':
            return {
                addKey: {
                    publicKey: mapPublicKey(action.publicKey),
                    accessKey: {
                        nonce: BigInt(action.accessKey.nonce),
                        permission:
                            action.accessKey.permission === 'FullAccess'
                                ? { fullAccess: {} }
                                : {
                                      functionCall: {
                                          allowance: action.accessKey.permission.allowance
                                              ? BigInt(action.accessKey.permission.allowance)
                                              : null,
                                          receiverId: action.accessKey.permission.receiverId,
                                          methodNames: action.accessKey.permission.methodNames,
                                      },
                                  },
                    },
                },
            };
        case 'DeleteKey':
            return { deleteKey: { publicKey: mapPublicKey(action.publicKey) } };
        case 'DeleteAccount':
            return { deleteAccount: { beneficiaryId: action.beneficiaryId } };
        case 'SignedDelegate':
            return {
                signedDelegate: {
                    delegateAction: mapAction(action.delegateAction),
                    signature: mapSignature(action.signature, action.publicKey),
                },
            };
        default:
            throw new Error(`Not implemented action: ${(action as PlainAction).type}`);
    }
}
