'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var FinalTransactionStatus;
(function (FinalTransactionStatus) {
    FinalTransactionStatus["Unknown"] = "Unknown";
    FinalTransactionStatus["Started"] = "Started";
    FinalTransactionStatus["Failed"] = "Failed";
    FinalTransactionStatus["Completed"] = "Completed";
})(FinalTransactionStatus = exports.FinalTransactionStatus || (exports.FinalTransactionStatus = {}));
class Provider {
}
exports.Provider = Provider;
function getTransactionLastResult(txResult) {
    for (let i = txResult.logs.length - 1; i >= 0; --i) {
        const r = txResult.logs[i];
        if (r.result && r.result.length > 0) {
            return JSON.parse(Buffer.from(r.result).toString());
        }
    }
    return null;
}
exports.getTransactionLastResult = getTransactionLastResult;
