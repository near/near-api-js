import type { PublicKey } from '../crypto/index.js';
import { Enum } from '../types/index.js';

import type { DelegateAction } from './delegate.js';
import type { Signature } from './signature.js';

export class FunctionCallPermission {
    allowance?: bigint;
    receiverId: string;
    methodNames: string[];

    constructor({ allowance, receiverId, methodNames }: { allowance?: bigint, receiverId: string, methodNames: string[] }) {
        this.allowance = allowance;
        this.receiverId = receiverId;
        this.methodNames = methodNames;
    }
}

export class FullAccessPermission {}

export class AccessKeyPermission extends Enum {
    enum!: string;
    functionCall?: FunctionCallPermission;
    fullAccess?: FullAccessPermission;

    constructor(props: any) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}

export class AccessKey {
    nonce: bigint;
    permission: AccessKeyPermission;

    constructor({ nonce, permission }: { nonce: bigint, permission: AccessKeyPermission }) {
        this.nonce = nonce;
        this.permission = permission;
    }
}


export class CreateAccount {}
export class DeployContract {
    code: Uint8Array;

    constructor({ code }: { code: Uint8Array }) {
        this.code = code;
    }

}
export class FunctionCall {
    methodName: string;
    args: Uint8Array;
    gas: bigint;
    deposit: bigint;

    constructor({ methodName, args, gas, deposit }: { methodName: string, args: Uint8Array, gas: bigint, deposit: bigint }) {
        this.methodName = methodName;
        this.args = args;
        this.gas = gas;
        this.deposit = deposit;
    }
}

export class GlobalContractDeployMode extends Enum {
    enum!: string;
    CodeHash?: null;
    AccountId?: null;

    constructor(props: { CodeHash?: null; AccountId?: null }) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}

export class GlobalContractIdentifier extends Enum {
    enum!: string;
    CodeHash?: Uint8Array;
    AccountId?: string;

    constructor(props: { CodeHash?: Uint8Array; AccountId?: string }) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}

export class DeployGlobalContract {
    code: Uint8Array;
    deployMode: GlobalContractDeployMode;

    constructor({ code, deployMode }: { code: Uint8Array; deployMode: GlobalContractDeployMode }) {
        this.code = code;
        this.deployMode = deployMode;
    }
}

export class UseGlobalContract {
    contractIdentifier: GlobalContractIdentifier;

    constructor({ contractIdentifier }: { contractIdentifier: GlobalContractIdentifier }) {
        this.contractIdentifier = contractIdentifier;
    }
}
export class Transfer {
    deposit: bigint;

    constructor({ deposit }: { deposit: bigint }) {
        this.deposit = deposit;
    }

}
export class Stake {
    stake: bigint;
    publicKey: PublicKey;

    constructor({ stake, publicKey }: { stake: bigint, publicKey: PublicKey }) {
        this.stake = stake;
        this.publicKey = publicKey;
    }
}
export class AddKey {
    publicKey: PublicKey;
    accessKey: AccessKey;

    constructor({ publicKey, accessKey }: { publicKey: PublicKey, accessKey: AccessKey }) {
        this.publicKey = publicKey;
        this.accessKey = accessKey;
    }
}
export class DeleteKey {
    publicKey: PublicKey;

    constructor({ publicKey }: { publicKey: PublicKey }) {
        this.publicKey = publicKey;
    }
}
export class DeleteAccount {
    beneficiaryId: string;

    constructor({ beneficiaryId }: { beneficiaryId: string }) {
        this.beneficiaryId = beneficiaryId;
    }
}
export class SignedDelegate {
    delegateAction: DelegateAction;
    signature: Signature;

    constructor({ delegateAction, signature }: { delegateAction: DelegateAction, signature: Signature }) {
        this.delegateAction = delegateAction;
        this.signature = signature;
    }
}

/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export class Action extends Enum {
    enum!: string;
    createAccount?: CreateAccount;
    deployContract?: DeployContract;
    functionCall?: FunctionCall;
    transfer?: Transfer;
    stake?: Stake;
    addKey?: AddKey;
    deleteKey?: DeleteKey;
    deleteAccount?: DeleteAccount;
    signedDelegate?: SignedDelegate;
    deployGlobalContract?: DeployGlobalContract;
    useGlobalContract?: UseGlobalContract;

    constructor(props: any) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}
