"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessKeyMatchesTransaction = void 0;
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
/**
 * @hidden
 * Check if given access key allows the function call or method attempted in transaction
 * @param accessKey Array of {access_key: AccessKey, public_key: PublicKey} items
 * @param receiverId The NEAR account attempting to have access
 * @param actions The action(s) needed to be checked for access
 */
async function accessKeyMatchesTransaction(accountId, accessKey, receiverId, actions) {
    const { access_key: { permission } } = accessKey;
    if (permission === 'FullAccess') {
        return true;
    }
    if (permission.FunctionCall) {
        const { receiver_id: allowedReceiverId, method_names: allowedMethods } = permission.FunctionCall;
        /********************************
        Accept multisig access keys and let wallets attempt to signAndSendTransaction
        If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
        ********************************/
        if (allowedReceiverId === accountId && allowedMethods.includes(MULTISIG_HAS_METHOD)) {
            return true;
        }
        if (allowedReceiverId === receiverId) {
            if (actions.length !== 1) {
                return false;
            }
            const [{ functionCall }] = actions;
            return functionCall &&
                (!functionCall.deposit || functionCall.deposit.toString() === '0') && // TODO: Should support charging amount smaller than allowance?
                (allowedMethods.length === 0 || allowedMethods.includes(functionCall.methodName));
            // TODO: Handle cases when allowance doesn't have enough to pay for gas
        }
    }
    // TODO: Support other permissions than FunctionCall
    return false;
}
exports.accessKeyMatchesTransaction = accessKeyMatchesTransaction;
