'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../utils/enums");
var ExecutionStatusBasic;
(function (ExecutionStatusBasic) {
    ExecutionStatusBasic["Unknown"] = "Unknown";
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
var LegacyFinalTransactionStatus;
(function (LegacyFinalTransactionStatus) {
    LegacyFinalTransactionStatus["Unknown"] = "Unknown";
    LegacyFinalTransactionStatus["Started"] = "Started";
    LegacyFinalTransactionStatus["Failed"] = "Failed";
    LegacyFinalTransactionStatus["Completed"] = "Completed";
})(LegacyFinalTransactionStatus || (LegacyFinalTransactionStatus = {}));
var LegacyTransactionStatus;
(function (LegacyTransactionStatus) {
    LegacyTransactionStatus["Unknown"] = "Unknown";
    LegacyTransactionStatus["Completed"] = "Completed";
    LegacyTransactionStatus["Failed"] = "Failed";
})(LegacyTransactionStatus || (LegacyTransactionStatus = {}));
function mapLegacyTransactionLog(tl) {
    let status;
    if (tl.result.status === LegacyTransactionStatus.Unknown) {
        status = ExecutionStatusBasic.Unknown;
    }
    else if (tl.result.status === LegacyTransactionStatus.Failed) {
        status = ExecutionStatusBasic.Failure;
    }
    else if (tl.result.status === LegacyTransactionStatus.Completed) {
        status = {
            SuccessValue: tl.result.result || ''
        };
    }
    return {
        id: tl.hash,
        outcome: {
            status,
            logs: tl.result.logs,
            receipt_ids: tl.result.receipts,
            gas_burnt: 0,
        },
    };
}
function adaptTransactionResult(txResult) {
    if ('transactions' in txResult) {
        txResult = txResult;
        let status;
        if (txResult.status === LegacyFinalTransactionStatus.Unknown) {
            status = FinalExecutionStatusBasic.NotStarted;
        }
        else if (txResult.status === LegacyFinalTransactionStatus.Started) {
            status = FinalExecutionStatusBasic.Started;
        }
        else if (txResult.status === LegacyFinalTransactionStatus.Failed) {
            status = FinalExecutionStatusBasic.Failure;
        }
        else if (txResult.status === LegacyFinalTransactionStatus.Completed) {
            let result = '';
            for (let i = txResult.transactions.length - 1; i >= 0; --i) {
                const r = txResult.transactions[i];
                if (r.result && r.result.result && r.result.result.length > 0) {
                    result = r.result.result;
                    break;
                }
            }
            status = {
                SuccessValue: result,
            };
        }
        return {
            status: status,
            transaction: mapLegacyTransactionLog(txResult.transactions.splice(0, 1)[0]),
            receipts: txResult.transactions.map(mapLegacyTransactionLog),
        };
    }
    else {
        return txResult;
    }
}
exports.adaptTransactionResult = adaptTransactionResult;
class Provider {
}
exports.Provider = Provider;
function getTransactionLastResult(txResult) {
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
exports.getTransactionLastResult = getTransactionLastResult;
