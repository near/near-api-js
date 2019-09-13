'use strict';

import BN from 'bn.js';
import { Account } from './account';
import { getTransactionLastResult } from './providers';

export class Contract {
    readonly account: Account;
    readonly contractId: string;

    constructor(account: Account, contractId: string, options: { viewMethods: string[], changeMethods: string[] }) {
        this.account = account;
        this.contractId = contractId;
        options.viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                value: async function(args: any) {
                    return this.account.viewFunction(this.contractId, methodName, args || {});
                }
            });
        });
        options.changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                value: async function(args: any, gas: number, amount?: BN) {
                    const rawResult = await this.account.functionCall(this.contractId, methodName, args || {}, gas, amount);
                    return getTransactionLastResult(rawResult);
                }
            });
        });
    }
}
