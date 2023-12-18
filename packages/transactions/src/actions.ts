import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';

import { DelegateAction } from './delegate';
import { Signature } from './signature';

abstract class Enum {
    enum: string;

    constructor(properties: any) {
        if (Object.keys(properties).length !== 1) {
            throw new Error('Enum can only take single value');
        }
        Object.keys(properties).map((key: string) => {
            (this as any)[key] = properties[key];
            this.enum = key;
        });
    }
}

export class FunctionCallPermission extends Assignable {
    allowance?: bigint;
    receiverId: string;
    methodNames: string[];
}

export class FullAccessPermission extends Assignable {}

export class AccessKeyPermission extends Enum {
    functionCall?: FunctionCallPermission;
    fullAccess?: FullAccessPermission;
}

export class AccessKey extends Assignable {
    nonce: bigint;
    permission: AccessKeyPermission;
}

export class IAction extends Assignable {}

export class CreateAccount extends IAction {}
export class DeployContract extends IAction { code: Uint8Array; }
export class FunctionCall extends IAction { methodName: string; args: Uint8Array; gas: bigint; deposit: bigint; }
export class Transfer extends IAction { deposit: bigint; }
export class Stake extends IAction { stake: bigint; publicKey: PublicKey; }
export class AddKey extends IAction { publicKey: PublicKey; accessKey: AccessKey; }
export class DeleteKey extends IAction { publicKey: PublicKey; }
export class DeleteAccount extends IAction { beneficiaryId: string; }
export class SignedDelegate extends IAction { delegateAction: DelegateAction; signature: Signature; }

/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export class Action extends Enum {
    createAccount?: CreateAccount;
    deployContract?: DeployContract;
    functionCall?: FunctionCall;
    transfer?: Transfer;
    stake?: Stake;
    addKey?: AddKey;
    deleteKey?: DeleteKey;
    deleteAccount?: DeleteAccount;
    signedDelegate?: SignedDelegate;
}
