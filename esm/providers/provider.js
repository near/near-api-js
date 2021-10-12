/**
 * NEAR RPC API request types and responses
 * @module
 */
export var ExecutionStatusBasic;
(function (ExecutionStatusBasic) {
    ExecutionStatusBasic["Unknown"] = "Unknown";
    ExecutionStatusBasic["Pending"] = "Pending";
    ExecutionStatusBasic["Failure"] = "Failure";
})(ExecutionStatusBasic || (ExecutionStatusBasic = {}));
export var FinalExecutionStatusBasic;
(function (FinalExecutionStatusBasic) {
    FinalExecutionStatusBasic["NotStarted"] = "NotStarted";
    FinalExecutionStatusBasic["Started"] = "Started";
    FinalExecutionStatusBasic["Failure"] = "Failure";
})(FinalExecutionStatusBasic || (FinalExecutionStatusBasic = {}));
export var IdType;
(function (IdType) {
    IdType["Transaction"] = "transaction";
    IdType["Receipt"] = "receipt";
})(IdType || (IdType = {}));
/** @hidden */
export class Provider {
}
/** @hidden */
export function getTransactionLastResult(txResult) {
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    }
    return null;
}
