'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ExecutionStatusBasic;
(function (ExecutionStatusBasic) {
    ExecutionStatusBasic["Unknown"] = "Unknown";
    ExecutionStatusBasic["Pending"] = "Pending";
    ExecutionStatusBasic["Failure"] = "Failure";
})(ExecutionStatusBasic = exports.ExecutionStatusBasic || (exports.ExecutionStatusBasic = {}));
var FinalExecutionStatusBasic;
(function (FinalExecutionStatusBasic) {
    FinalExecutionStatusBasic["NotStarted"] = "NotStarted";
    FinalExecutionStatusBasic["Started"] = "Started";
    FinalExecutionStatusBasic["Failure"] = "Failure";
})(FinalExecutionStatusBasic = exports.FinalExecutionStatusBasic || (exports.FinalExecutionStatusBasic = {}));
// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
var LegacyFinalTransactionStatus;
(function (LegacyFinalTransactionStatus) {
    LegacyFinalTransactionStatus["Unknown"] = "Unknown";
    LegacyFinalTransactionStatus["Started"] = "Started";
    LegacyFinalTransactionStatus["Failed"] = "Failed";
    LegacyFinalTransactionStatus["Completed"] = "Completed";
})(LegacyFinalTransactionStatus || (LegacyFinalTransactionStatus = {}));
// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
var LegacyTransactionStatus;
(function (LegacyTransactionStatus) {
    LegacyTransactionStatus["Unknown"] = "Unknown";
    LegacyTransactionStatus["Completed"] = "Completed";
    LegacyTransactionStatus["Failed"] = "Failed";
})(LegacyTransactionStatus || (LegacyTransactionStatus = {}));
// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
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
// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
function fixLegacyBasicExecutionOutcomeFailure(t) {
    if (t.outcome.status === ExecutionStatusBasic.Failure) {
        t.outcome.status = {
            Failure: {
                error_message: t.outcome.logs.find(it => it.startsWith('ABORT:')) ||
                    t.outcome.logs.find(it => it.startsWith('Runtime error:')) || '',
                error_type: 'LegacyError',
            }
        };
    }
    return t;
}
// TODO(#86): Remove legacy code, once nearcore 0.4.0 is released.
function adaptTransactionResult(txResult) {
    // Fixing legacy transaction result
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
        txResult = {
            status,
            transaction: mapLegacyTransactionLog(txResult.transactions.splice(0, 1)[0]),
            receipts: txResult.transactions.map(mapLegacyTransactionLog),
        };
    }
    // Adapting from old error handling.
    txResult.transaction = fixLegacyBasicExecutionOutcomeFailure(txResult.transaction);
    txResult.receipts = txResult.receipts.map(fixLegacyBasicExecutionOutcomeFailure);
    // Fixing master error status
    if (txResult.status === FinalExecutionStatusBasic.Failure) {
        const err = [txResult.transaction, ...txResult.receipts]
            .find(t => typeof t.outcome.status === 'object' && typeof t.outcome.status.Failure === 'object')
            .outcome.status.Failure;
        txResult.status = {
            Failure: err
        };
    }
    return txResult;
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
