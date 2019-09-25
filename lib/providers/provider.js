'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../utils/enums");
var ExecutionStatusBasic;
(function (ExecutionStatusBasic) {
    ExecutionStatusBasic["Pending"] = "Pending";
    ExecutionStatusBasic["Failure"] = "Failure";
})(ExecutionStatusBasic = exports.ExecutionStatusBasic || (exports.ExecutionStatusBasic = {}));
class ExecutionStatus extends enums_1.Enum {
}
exports.ExecutionStatus = ExecutionStatus;
var FinalExecutionStatusBasic;
(function (FinalExecutionStatusBasic) {
    FinalExecutionStatusBasic["NotStarted"] = "NotStarted";
    FinalExecutionStatusBasic["Started"] = "Started";
    FinalExecutionStatusBasic["Failure"] = "Failure";
})(FinalExecutionStatusBasic = exports.FinalExecutionStatusBasic || (exports.FinalExecutionStatusBasic = {}));
class FinalExecutionStatus extends enums_1.Enum {
}
exports.FinalExecutionStatus = FinalExecutionStatus;
class Provider {
}
exports.Provider = Provider;
function getTransactionLastResult(txResult) {
    if (typeof txResult.status === 'object' && txResult.status.SuccessValue !== null) {
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
exports.getTransactionLastResult = getTransactionLastResult;
