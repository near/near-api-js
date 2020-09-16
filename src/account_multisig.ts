'use strict';

import BN from 'bn.js';
import { Account } from './account';
import { Contract } from './contract';
import { Connection } from './connection';
import { parseNearAmount } from './utils/format';
import { Action, functionCall } from './transaction';
import { FinalExecutionOutcome } from './providers';

const MULTISIG_DEPOSIT = new BN('0');
const MULTISIG_ALLOWANCE = process.env.WALLET_2FA_ALLOWANCE || parseNearAmount('1');
const MULTISIG_GAS = new BN(process.env.WALLET_2FA_ALLOWANCE || '100000000000000');
export const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
export const VIEW_METHODS = ['get_request_nonce', 'list_request_ids'];

export class AccountMultisig extends Account {
    public contract: MultisigContract;

    constructor(connection: Connection, accountId: string) {
        super(connection, accountId);
        this.contract = getContract(this);
    }

    protected async signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        const { accountId } = this;

        const args = new Uint8Array(new TextEncoder().encode(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        })));
        
        return super.signAndSendTransaction(accountId, [
            functionCall('add_request_and_confirm', args, MULTISIG_GAS, MULTISIG_DEPOSIT)
        ]);
    }
}

// define function multisig contract functions for TypeScript
export class MultisigContract extends Contract {
    get_request_nonce() {
        return this.get_request_nonce()
    }
    list_request_ids() {
        return this.list_request_ids()
    }
}

// helpers
const getContract = (account) => {
    return new MultisigContract(account, account.accountId, {
        viewMethods: VIEW_METHODS,
        changeMethods: METHOD_NAMES_LAK,
    });
};

const convertPKForContract = (pk) => {
    if (typeof pk !== 'string') {
        pk = pk.toString();
    }
    return pk.replace('ed25519:', '');
};

const convertActions = (actions, accountId, receiverId) => actions.map((a) => {
    const type = a.enum;
    const { gas, publicKey, methodName, args, deposit, accessKey, code } = a[type];
    const action = {
        type: type[0].toUpperCase() + type.substr(1),
        gas: (gas && gas.toString()) || undefined,
        public_key: (publicKey && convertPKForContract(publicKey)) || undefined,
        method_name: methodName,
        args: (args && Buffer.from(args).toString('base64')) || undefined,
        code: (code && Buffer.from(code).toString('base64')) || undefined,
        amount: (deposit && deposit.toString()) || undefined,
        permission: null,
        accessKey: null,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: MULTISIG_ALLOWANCE,
                method_names: METHOD_NAMES_LAK,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance,  } = action.accessKey.permission.functionCall;
            action.permission = { receiver_id, allowance, method_names };
        }
    }
    return action;
});
