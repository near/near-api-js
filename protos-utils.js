const protos = require('./protos');

const TRANSACTION_FIELD_MAP = new Map([
    [protos.CreateAccountTransaction, 'createAccount'],
    [protos.DeployContractTransaction, 'deployContract'],
    [protos.FunctionCallTransaction, 'functionCall'],
    [protos.SendMoneyTransaction, 'sendMoney'],
    [protos.StakeTransaction, 'stake'],
    [protos.SwapKeyTransaction, 'swapKey'],
    [protos.AddKeyTransaction, 'addKey'],
    [protos.DeleteKeyTransaction, 'deleteKey'],
]);

module.exports.getTransactionFieldName = (transactionProto) => TRANSACTION_FIELD_MAP.get(transactionProto.constructor);
