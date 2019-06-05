const protos = require('./protos');

const TRANSACTION_FIELD_MAP = {
    [protos.CreateAccountTransaction.name]: 'createAccount',
    [protos.DeployContractTransaction.name]: 'deployContract',
    [protos.FunctionCallTransaction.name]: 'functionCall',
    [protos.SendMoneyTransaction.name]: 'sendMoney',
    [protos.StakeTransaction.name]: 'stake',
    [protos.SwapKeyTransaction.name]: 'swapKey',
    [protos.AddKeyTransaction.name]: 'addKey',
    [protos.DeleteKeyTransaction.name]: 'deleteKey',
};

module.exports.getTransactionFieldName = (transactionProto) => TRANSACTION_FIELD_MAP[transactionProto.constructor.name];
