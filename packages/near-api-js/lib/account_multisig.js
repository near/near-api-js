'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account2FA = exports.AccountMultisig = exports.MultisigStateStatus = exports.MultisigDeleteRequestRejectionError = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const format_1 = require("./utils/format");
const key_pair_1 = require("./utils/key_pair");
const transaction_1 = require("./transaction");
const providers_1 = require("./providers");
const web_1 = require("./utils/web");
exports.MULTISIG_STORAGE_KEY = '__multisigRequest';
exports.MULTISIG_ALLOWANCE = new bn_js_1.default((0, format_1.parseNearAmount)('1'));
// TODO: Different gas value for different requests (can reduce gas usage dramatically)
exports.MULTISIG_GAS = new bn_js_1.default('100000000000000');
exports.MULTISIG_DEPOSIT = new bn_js_1.default('0');
exports.MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
exports.MULTISIG_CONFIRM_METHODS = ['confirm'];
var MultisigDeleteRequestRejectionError;
(function (MultisigDeleteRequestRejectionError) {
    MultisigDeleteRequestRejectionError["CANNOT_DESERIALIZE_STATE"] = "Cannot deserialize the contract state";
    MultisigDeleteRequestRejectionError["MULTISIG_NOT_INITIALIZED"] = "Smart contract panicked: Multisig contract should be initialized before usage";
    MultisigDeleteRequestRejectionError["NO_SUCH_REQUEST"] = "Smart contract panicked: panicked at 'No such request: either wrong number or already confirmed'";
    MultisigDeleteRequestRejectionError["REQUEST_COOLDOWN_ERROR"] = "Request cannot be deleted immediately after creation.";
    MultisigDeleteRequestRejectionError["METHOD_NOT_FOUND"] = "Contract method is not found";
})(MultisigDeleteRequestRejectionError = exports.MultisigDeleteRequestRejectionError || (exports.MultisigDeleteRequestRejectionError = {}));
;
var MultisigStateStatus;
(function (MultisigStateStatus) {
    MultisigStateStatus[MultisigStateStatus["INVALID_STATE"] = 0] = "INVALID_STATE";
    MultisigStateStatus[MultisigStateStatus["STATE_NOT_INITIALIZED"] = 1] = "STATE_NOT_INITIALIZED";
    MultisigStateStatus[MultisigStateStatus["VALID_STATE"] = 2] = "VALID_STATE";
    MultisigStateStatus[MultisigStateStatus["UNKNOWN_STATE"] = 3] = "UNKNOWN_STATE";
})(MultisigStateStatus = exports.MultisigStateStatus || (exports.MultisigStateStatus = {}));
var MultisigCodeStatus;
(function (MultisigCodeStatus) {
    MultisigCodeStatus[MultisigCodeStatus["INVALID_CODE"] = 0] = "INVALID_CODE";
    MultisigCodeStatus[MultisigCodeStatus["VALID_CODE"] = 1] = "VALID_CODE";
    MultisigCodeStatus[MultisigCodeStatus["UNKNOWN_CODE"] = 2] = "UNKNOWN_CODE";
})(MultisigCodeStatus || (MultisigCodeStatus = {}));
// in memory request cache for node w/o localStorage
const storageFallback = {
    [exports.MULTISIG_STORAGE_KEY]: null
};
class AccountMultisig extends account_1.Account {
    constructor(connection, accountId, options) {
        super(connection, accountId);
        this.storage = options.storage;
        this.onAddRequestResult = options.onAddRequestResult;
    }
    signAndSendTransactionWithAccount(receiverId, actions) {
        const _super = Object.create(null, {
            signAndSendTransaction: { get: () => super.signAndSendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.signAndSendTransaction.call(this, { receiverId, actions });
        });
    }
    signAndSendTransaction({ receiverId, actions }) {
        const _super = Object.create(null, {
            signAndSendTransaction: { get: () => super.signAndSendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const args = Buffer.from(JSON.stringify({
                request: {
                    receiver_id: receiverId,
                    actions: convertActions(actions, accountId, receiverId)
                }
            }));
            let result;
            try {
                result = yield _super.signAndSendTransaction.call(this, {
                    receiverId: accountId,
                    actions: [
                        (0, transaction_1.functionCall)('add_request_and_confirm', args, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
                    ]
                });
            }
            catch (e) {
                if (e.toString().includes('Account has too many active requests. Confirm or delete some')) {
                    yield this.deleteUnconfirmedRequests();
                    return yield this.signAndSendTransaction({ receiverId, actions });
                }
                throw e;
            }
            // TODO: Are following even needed? Seems like it throws on error already
            if (!result.status) {
                throw new Error('Request failed');
            }
            const status = Object.assign({}, result.status);
            if (!status.SuccessValue || typeof status.SuccessValue !== 'string') {
                throw new Error('Request failed');
            }
            this.setRequest({
                accountId,
                actions,
                requestId: parseInt(Buffer.from(status.SuccessValue, 'base64').toString('ascii'), 10)
            });
            if (this.onAddRequestResult) {
                yield this.onAddRequestResult(result);
            }
            // NOTE there is no await on purpose to avoid blocking for 2fa
            this.deleteUnconfirmedRequests();
            return result;
        });
    }
    /*
     * This method submits a canary transaction that is expected to always fail in order to determine whether the contract currently has valid multisig state
     * and whether it is initialized. The canary transaction attempts to delete a request at index u32_max and will go through if a request exists at that index.
     * a u32_max + 1 and -1 value cannot be used for the canary due to expected u32 error thrown before deserialization attempt.
     */
    checkMultisigCodeAndStateStatus(contractBytes) {
        const _super = Object.create(null, {
            signAndSendTransaction: { get: () => super.signAndSendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const u32_max = 4294967295;
            const validCodeStatusIfNoDeploy = contractBytes ? MultisigCodeStatus.UNKNOWN_CODE : MultisigCodeStatus.VALID_CODE;
            try {
                if (contractBytes) {
                    yield _super.signAndSendTransaction.call(this, {
                        receiverId: this.accountId, actions: [
                            (0, transaction_1.deployContract)(contractBytes),
                            (0, transaction_1.functionCall)('delete_request', { request_id: u32_max }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
                        ]
                    });
                }
                else {
                    yield this.deleteRequest(u32_max);
                }
                return { codeStatus: MultisigCodeStatus.VALID_CODE, stateStatus: MultisigStateStatus.VALID_STATE };
            }
            catch (e) {
                if (new RegExp(MultisigDeleteRequestRejectionError.CANNOT_DESERIALIZE_STATE).test(e && e.kind && e.kind.ExecutionError)) {
                    return { codeStatus: validCodeStatusIfNoDeploy, stateStatus: MultisigStateStatus.INVALID_STATE };
                }
                else if (new RegExp(MultisigDeleteRequestRejectionError.MULTISIG_NOT_INITIALIZED).test(e && e.kind && e.kind.ExecutionError)) {
                    return { codeStatus: validCodeStatusIfNoDeploy, stateStatus: MultisigStateStatus.STATE_NOT_INITIALIZED };
                }
                else if (new RegExp(MultisigDeleteRequestRejectionError.NO_SUCH_REQUEST).test(e && e.kind && e.kind.ExecutionError)) {
                    return { codeStatus: validCodeStatusIfNoDeploy, stateStatus: MultisigStateStatus.VALID_STATE };
                }
                else if (new RegExp(MultisigDeleteRequestRejectionError.METHOD_NOT_FOUND).test(e && e.message)) {
                    // not reachable if transaction included a deploy
                    return { codeStatus: MultisigCodeStatus.INVALID_CODE, stateStatus: MultisigStateStatus.UNKNOWN_STATE };
                }
                throw e;
            }
        });
    }
    deleteRequest(request_id) {
        return super.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [(0, transaction_1.functionCall)('delete_request', { request_id }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)]
        });
    }
    deleteAllRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const request_ids = yield this.getRequestIds();
            if (request_ids.length) {
                yield Promise.all(request_ids.map((id) => this.deleteRequest(id)));
            }
        });
    }
    deleteUnconfirmedRequests() {
        const _super = Object.create(null, {
            signAndSendTransaction: { get: () => super.signAndSendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Delete in batch, don't delete unexpired
            // TODO: Delete in batch, don't delete unexpired (can reduce gas usage dramatically)
            const request_ids = yield this.getRequestIds();
            const { requestId } = this.getRequest();
            for (const requestIdToDelete of request_ids) {
                if (requestIdToDelete == requestId) {
                    continue;
                }
                try {
                    yield _super.signAndSendTransaction.call(this, {
                        receiverId: this.accountId,
                        actions: [(0, transaction_1.functionCall)('delete_request', { request_id: requestIdToDelete }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)]
                    });
                }
                catch (e) {
                    console.warn('Attempt to delete an earlier request before 15 minutes failed. Will try again.');
                }
            }
        });
    }
    // helpers
    getRequestIds() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Read requests from state to allow filtering by expiration time
            // TODO: https://github.com/near/core-contracts/blob/305d1db4f4f2cf5ce4c1ef3479f7544957381f11/multisig/src/lib.rs#L84
            return this.viewFunction(this.accountId, 'list_request_ids');
        });
    }
    getRequest() {
        if (this.storage) {
            return JSON.parse(this.storage.getItem(exports.MULTISIG_STORAGE_KEY) || '{}');
        }
        return storageFallback[exports.MULTISIG_STORAGE_KEY];
    }
    setRequest(data) {
        if (this.storage) {
            return this.storage.setItem(exports.MULTISIG_STORAGE_KEY, JSON.stringify(data));
        }
        storageFallback[exports.MULTISIG_STORAGE_KEY] = data;
    }
}
exports.AccountMultisig = AccountMultisig;
class Account2FA extends AccountMultisig {
    constructor(connection, accountId, options) {
        super(connection, accountId, options);
        this.helperUrl = 'https://helper.testnet.near.org';
        this.helperUrl = options.helperUrl || this.helperUrl;
        this.storage = options.storage;
        this.sendCode = options.sendCode || this.sendCodeDefault;
        this.getCode = options.getCode || this.getCodeDefault;
        this.verifyCode = options.verifyCode || this.verifyCodeDefault;
        this.onConfirmResult = options.onConfirmResult;
    }
    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    signAndSendTransaction({ receiverId, actions }) {
        const _super = Object.create(null, {
            signAndSendTransaction: { get: () => super.signAndSendTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.signAndSendTransaction.call(this, { receiverId, actions });
            // TODO: Should following override onRequestResult in superclass instead of doing custom signAndSendTransaction?
            yield this.sendCode();
            const result = yield this.promptAndVerify();
            if (this.onConfirmResult) {
                yield this.onConfirmResult(result);
            }
            return result;
        });
    }
    // default helpers for CH deployments of multisig
    deployMultisig(contractBytes) {
        const _super = Object.create(null, {
            signAndSendTransactionWithAccount: { get: () => super.signAndSendTransactionWithAccount }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const seedOrLedgerKey = (yield this.getRecoveryMethods()).data
                .filter(({ kind, publicKey }) => (kind === 'phrase' || kind === 'ledger') && publicKey !== null)
                .map((rm) => rm.publicKey);
            const fak2lak = (yield this.getAccessKeys())
                .filter(({ public_key, access_key: { permission } }) => permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key))
                .map((ak) => ak.public_key)
                .map(toPK);
            const confirmOnlyKey = toPK((yield this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
            const newArgs = Buffer.from(JSON.stringify({ 'num_confirmations': 2 }));
            const actions = [
                ...fak2lak.map((pk) => (0, transaction_1.deleteKey)(pk)),
                ...fak2lak.map((pk) => (0, transaction_1.addKey)(pk, (0, transaction_1.functionCallAccessKey)(accountId, exports.MULTISIG_CHANGE_METHODS, null))),
                (0, transaction_1.addKey)(confirmOnlyKey, (0, transaction_1.functionCallAccessKey)(accountId, exports.MULTISIG_CONFIRM_METHODS, null)),
                (0, transaction_1.deployContract)(contractBytes),
            ];
            const newFunctionCallActionBatch = actions.concat((0, transaction_1.functionCall)('new', newArgs, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT));
            console.log('deploying multisig contract for', accountId);
            const { stateStatus: multisigStateStatus } = yield this.checkMultisigCodeAndStateStatus(contractBytes);
            switch (multisigStateStatus) {
                case MultisigStateStatus.STATE_NOT_INITIALIZED:
                    return yield _super.signAndSendTransactionWithAccount.call(this, accountId, newFunctionCallActionBatch);
                case MultisigStateStatus.VALID_STATE:
                    return yield _super.signAndSendTransactionWithAccount.call(this, accountId, actions);
                case MultisigStateStatus.INVALID_STATE:
                    throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState');
                default:
                    throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
            }
        });
    }
    disableWithFAK({ contractBytes, cleanupContractBytes }) {
        return __awaiter(this, void 0, void 0, function* () {
            let cleanupActions = [];
            if (cleanupContractBytes) {
                yield this.deleteAllRequests().catch(e => e);
                cleanupActions = yield this.get2faDisableCleanupActions(cleanupContractBytes);
            }
            const keyConversionActions = yield this.get2faDisableKeyConversionActions();
            const actions = [
                ...cleanupActions,
                ...keyConversionActions,
                (0, transaction_1.deployContract)(contractBytes)
            ];
            const accessKeyInfo = yield this.findAccessKey(this.accountId, actions);
            if (accessKeyInfo && accessKeyInfo.accessKey && accessKeyInfo.accessKey.permission !== 'FullAccess') {
                throw new providers_1.TypedError(`No full access key found in keystore. Unable to bypass multisig`, 'NoFAKFound');
            }
            return this.signAndSendTransactionWithAccount(this.accountId, actions);
        });
    }
    get2faDisableCleanupActions(cleanupContractBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentAccountState = yield this.viewState('').catch(error => {
                const cause = error.cause && error.cause.name;
                if (cause == 'NO_CONTRACT_CODE') {
                    return [];
                }
                throw cause == 'TOO_LARGE_CONTRACT_STATE'
                    ? new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState')
                    : error;
            });
            const currentAccountStateKeys = currentAccountState.map(({ key }) => key.toString('base64'));
            return currentAccountState.length ? [
                (0, transaction_1.deployContract)(cleanupContractBytes),
                (0, transaction_1.functionCall)('clean', { keys: currentAccountStateKeys }, exports.MULTISIG_GAS, new bn_js_1.default('0'))
            ] : [];
        });
    }
    get2faDisableKeyConversionActions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const accessKeys = yield this.getAccessKeys();
            const lak2fak = accessKeys
                .filter(({ access_key }) => access_key.permission !== 'FullAccess')
                .filter(({ access_key }) => {
                const perm = access_key.permission.FunctionCall;
                return perm.receiver_id === accountId &&
                    perm.method_names.length === 4 &&
                    perm.method_names.includes('add_request_and_confirm');
            });
            const confirmOnlyKey = key_pair_1.PublicKey.from((yield this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
            return [
                (0, transaction_1.deleteKey)(confirmOnlyKey),
                ...lak2fak.map(({ public_key }) => (0, transaction_1.deleteKey)(key_pair_1.PublicKey.from(public_key))),
                ...lak2fak.map(({ public_key }) => (0, transaction_1.addKey)(key_pair_1.PublicKey.from(public_key), (0, transaction_1.fullAccessKey)()))
            ];
        });
    }
    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true}
     */
    disable(contractBytes, cleanupContractBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stateStatus } = yield this.checkMultisigCodeAndStateStatus();
            if (stateStatus !== MultisigStateStatus.VALID_STATE && stateStatus !== MultisigStateStatus.STATE_NOT_INITIALIZED) {
                throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
            }
            let deleteAllRequestsError;
            yield this.deleteAllRequests().catch(e => deleteAllRequestsError = e);
            const cleanupActions = yield this.get2faDisableCleanupActions(cleanupContractBytes).catch(e => {
                if (e.type === 'ContractHasExistingState') {
                    throw deleteAllRequestsError || e;
                }
                throw e;
            });
            const actions = [
                ...cleanupActions,
                ...(yield this.get2faDisableKeyConversionActions()),
                (0, transaction_1.deployContract)(contractBytes),
            ];
            console.log('disabling 2fa for', this.accountId);
            return yield this.signAndSendTransaction({
                receiverId: this.accountId,
                actions
            });
        });
    }
    sendCodeDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const { requestId } = this.getRequest();
            const method = yield this.get2faMethod();
            yield this.postSignedJson('/2fa/send', {
                accountId,
                method,
                requestId,
            });
            return requestId;
        });
    }
    getCodeDefault(method) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
        });
    }
    promptAndVerify() {
        return __awaiter(this, void 0, void 0, function* () {
            const method = yield this.get2faMethod();
            const securityCode = yield this.getCode(method);
            try {
                const result = yield this.verifyCode(securityCode);
                // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
                return result;
            }
            catch (e) {
                console.warn('Error validating security code:', e);
                if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                    return yield this.promptAndVerify();
                }
                throw e;
            }
        });
    }
    verifyCodeDefault(securityCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const request = this.getRequest();
            if (!request) {
                throw new Error('no request pending');
            }
            const { requestId } = request;
            return yield this.postSignedJson('/2fa/verify', {
                accountId,
                securityCode,
                requestId
            });
        });
    }
    getRecoveryMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            return {
                accountId,
                data: yield this.postSignedJson('/account/recoveryMethods', { accountId })
            };
        });
    }
    get2faMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            let { data } = yield this.getRecoveryMethods();
            if (data && data.length) {
                data = data.find((m) => m.kind.indexOf('2fa-') === 0);
            }
            if (!data)
                return null;
            const { kind, detail } = data;
            return { kind, detail };
        });
    }
    signatureFor() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accountId } = this;
            const block = yield this.connection.provider.block({ finality: 'final' });
            const blockNumber = block.header.height.toString();
            const signed = yield this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, this.connection.networkId);
            const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
            return { blockNumber, blockNumberSignature };
        });
    }
    postSignedJson(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, web_1.fetchJson)(this.helperUrl + path, JSON.stringify(Object.assign(Object.assign({}, body), (yield this.signatureFor()))));
        });
    }
}
exports.Account2FA = Account2FA;
// helpers
const toPK = (pk) => key_pair_1.PublicKey.from(pk);
const convertPKForContract = (pk) => pk.toString().replace('ed25519:', '');
const convertActions = (actions, accountId, receiverId) => actions.map((a) => {
    const type = a.enum;
    const { gas, publicKey, methodName, args, deposit, accessKey, code } = a[type];
    const action = {
        type: type[0].toUpperCase() + type.substr(1),
        gas: (gas && gas.toString()) || undefined,
        public_key: (publicKey && convertPKForContract(publicKey)) || undefined,
        method_name: methodName,
        args: (args && Buffer.from(args).toString('base64')) || undefined,
        code: (code && Buffer.from(code).toString('base64')) || undefined,
        amount: (deposit && deposit.toString()) || undefined,
        deposit: (deposit && deposit.toString()) || '0',
        permission: undefined,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: exports.MULTISIG_ALLOWANCE.toString(),
                method_names: exports.MULTISIG_CHANGE_METHODS,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance } = accessKey.permission.functionCall;
            action.permission = {
                receiver_id,
                allowance: (allowance && allowance.toString()) || undefined,
                method_names
            };
        }
    }
    return action;
});
