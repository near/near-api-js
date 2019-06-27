'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Contract {
    constructor(account, contractId, options) {
        this.account = account;
        this.contractId = contractId;
        options.viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                value: async function (args) {
                    return this.account.viewFunction(this.contractId, methodName, args || {});
                }
            });
        });
        options.changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                value: async function (args) {
                    return this.account.functionCall(this.contractId, methodName, args || {});
                }
            });
        });
    }
}
exports.Contract = Contract;
