import { Assignable, PublicKey } from '@near-js/client-core';
import BN from 'bn.js';

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
    allowance?: BN;
    receiverId: string;
    methodNames: string[];
}

export class FullAccessPermission extends Assignable {}

export class AccessKeyPermission extends Enum {
    functionCall: FunctionCallPermission;
    fullAccess: FullAccessPermission;
}

export class AccessKey extends Assignable {
    permission: AccessKeyPermission;
}

export class IAction extends Assignable {}

export class CreateAccount extends IAction {}
export class DeployContract extends IAction { code: Uint8Array; }
export class FunctionCall extends IAction { methodName: string; args: Uint8Array; gas: BN; deposit: BN; }
export class Transfer extends IAction { deposit: BN; }
export class Stake extends IAction { stake: BN; publicKey: PublicKey; }
export class AddKey extends IAction { publicKey: PublicKey; accessKey: AccessKey; }
export class DeleteKey extends IAction { publicKey: PublicKey; }
export class DeleteAccount extends IAction { beneficiaryId: string; }

/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export class Action extends Enum {
    createAccount: CreateAccount;
    deployContract: DeployContract;
    functionCall: FunctionCall;
    transfer: Transfer;
    stake: Stake;
    addKey: AddKey;
    deleteKey: DeleteKey;
    deleteAccount: DeleteAccount;
}
