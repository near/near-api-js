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
    for (let i = txResult.transactions.length - 1; i >= 0; --i) {
        const r = txResult.transactions[i];
        if (r.result && r.result.result && r.result.result.length > 0) {
            return JSON.parse(Buffer.from(r.result.result, 'base64').toString());
        }
    }
    return null;
}
exports.getTransactionLastResult = getTransactionLastResult;
