'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("./providers");
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
                    const rawResult = await this.account.functionCall(this.contractId, methodName, args || {});
                    return providers_1.getTransactionLastResult(rawResult);
                }
            });
        });
    }
}
exports.Contract = Contract;
