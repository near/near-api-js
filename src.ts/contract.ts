'use strict';

import { Account } from './account';

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
            }});
        });
        options.changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                value: async function(args: any) {
                return this.account.functionCall(this.contractId, methodName, args || {});
            }});
        });
    }
}
