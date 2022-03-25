'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account2FA = exports.AccountMultisig = exports.MultisigStateStatus = exports.MultisigDeleteRequestRejectionError = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const depd_1 = __importDefault(require("depd"));
const account_1 = require("./account");
const format_1 = require("./utils/format");
const key_pair_1 = require("./utils/key_pair");
const transaction_1 = require("./transaction");
const providers_1 = require("./providers");
const web_1 = require("./utils/web");
exports.MULTISIG_STORAGE_KEY = '__multisigRequest';
exports.MULTISIG_ALLOWANCE = new bn_js_1.default(format_1.parseNearAmount('1'));
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
    async signAndSendTransactionWithAccount(receiverId, actions) {
        return super.signAndSendTransaction({ receiverId, actions });
    }
    signAndSendTransaction(...args) {
        if (typeof args[0] === 'string') {
            return this._signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }
        return this._signAndSendTransaction(args[0]);
    }
    async _signAndSendTransaction({ receiverId, actions }) {
        const { accountId } = this;
        const args = Buffer.from(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        }));
        let result;
        try {
            result = await super.signAndSendTransaction({
                receiverId: accountId,
                actions: [
                    transaction_1.functionCall('add_request_and_confirm', args, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
                ]
            });
        }
        catch (e) {
            if (e.toString().includes('Account has too many active requests. Confirm or delete some')) {
                await this.deleteUnconfirmedRequests();
                return await this.signAndSendTransaction(receiverId, actions);
            }
            throw e;
        }
        // TODO: Are following even needed? Seems like it throws on error already
        if (!result.status) {
            throw new Error('Request failed');
        }
        const status = { ...result.status };
        if (!status.SuccessValue || typeof status.SuccessValue !== 'string') {
            throw new Error('Request failed');
        }
        this.setRequest({
            accountId,
            actions,
            requestId: parseInt(Buffer.from(status.SuccessValue, 'base64').toString('ascii'), 10)
        });
        if (this.onAddRequestResult) {
            await this.onAddRequestResult(result);
        }
        // NOTE there is no await on purpose to avoid blocking for 2fa
        this.deleteUnconfirmedRequests();
        return result;
    }
    /*
     * This method submits a canary transaction that is expected to always fail in order to determine whether the contract currently has valid multisig state
     * and whether it is initialized. The canary transaction attempts to delete a request at index u32_max and will go through if a request exists at that index.
     * a u32_max + 1 and -1 value cannot be used for the canary due to expected u32 error thrown before deserialization attempt.
     */
    async checkMultisigCodeAndStateStatus(contractBytes) {
        const u32_max = 4294967295;
        const validCodeStatusIfNoDeploy = contractBytes ? MultisigCodeStatus.UNKNOWN_CODE : MultisigCodeStatus.VALID_CODE;
        try {
            if (contractBytes) {
                await super.signAndSendTransaction({
                    receiverId: this.accountId, actions: [
                        transaction_1.deployContract(contractBytes),
                        transaction_1.functionCall('delete_request', { request_id: u32_max }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
                    ]
                });
            }
            else {
                await this.deleteRequest(u32_max);
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
    }
    deleteRequest(request_id) {
        return super.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [transaction_1.functionCall('delete_request', { request_id }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)]
        });
    }
    async deleteAllRequests() {
        const request_ids = await this.getRequestIds();
        if (request_ids.length) {
            await Promise.all(request_ids.map((id) => this.deleteRequest(id)));
        }
    }
    async deleteUnconfirmedRequests() {
        // TODO: Delete in batch, don't delete unexpired
        // TODO: Delete in batch, don't delete unexpired (can reduce gas usage dramatically)
        const request_ids = await this.getRequestIds();
        const { requestId } = this.getRequest();
        for (const requestIdToDelete of request_ids) {
            if (requestIdToDelete == requestId) {
                continue;
            }
            try {
                await super.signAndSendTransaction({
                    receiverId: this.accountId,
                    actions: [transaction_1.functionCall('delete_request', { request_id: requestIdToDelete }, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)]
                });
            }
            catch (e) {
                console.warn('Attempt to delete an earlier request before 15 minutes failed. Will try again.');
            }
        }
    }
    // helpers
    async getRequestIds() {
        // TODO: Read requests from state to allow filtering by expiration time
        // TODO: https://github.com/near/core-contracts/blob/305d1db4f4f2cf5ce4c1ef3479f7544957381f11/multisig/src/lib.rs#L84
        return this.viewFunction(this.accountId, 'list_request_ids');
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
    async signAndSendTransaction(...args) {
        if (typeof args[0] === 'string') {
            const deprecate = depd_1.default('Account.signAndSendTransaction(receiverId, actions');
            deprecate('use `Account2FA.signAndSendTransaction(SignAndSendTransactionOptions)` instead');
            return this.__signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }
        else {
            return this.__signAndSendTransaction(args[0]);
        }
    }
    async __signAndSendTransaction({ receiverId, actions }) {
        await super.signAndSendTransaction({ receiverId, actions });
        // TODO: Should following override onRequestResult in superclass instead of doing custom signAndSendTransaction?
        await this.sendCode();
        const result = await this.promptAndVerify();
        if (this.onConfirmResult) {
            await this.onConfirmResult(result);
        }
        return result;
    }
    // default helpers for CH deployments of multisig
    async deployMultisig(contractBytes) {
        const { accountId } = this;
        const seedOrLedgerKey = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => (kind === 'phrase' || kind === 'ledger') && publicKey !== null)
            .map((rm) => rm.publicKey);
        const fak2lak = (await this.getAccessKeys())
            .filter(({ public_key, access_key: { permission } }) => permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key))
            .map((ak) => ak.public_key)
            .map(toPK);
        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const newArgs = Buffer.from(JSON.stringify({ 'num_confirmations': 2 }));
        const actions = [
            ...fak2lak.map((pk) => transaction_1.deleteKey(pk)),
            ...fak2lak.map((pk) => transaction_1.addKey(pk, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CHANGE_METHODS, null))),
            transaction_1.addKey(confirmOnlyKey, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CONFIRM_METHODS, null)),
            transaction_1.deployContract(contractBytes),
        ];
        const newFunctionCallActionBatch = actions.concat(transaction_1.functionCall('new', newArgs, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT));
        console.log('deploying multisig contract for', accountId);
        const { stateStatus: multisigStateStatus } = await this.checkMultisigCodeAndStateStatus(contractBytes);
        switch (multisigStateStatus) {
            case MultisigStateStatus.STATE_NOT_INITIALIZED:
                return await super.signAndSendTransactionWithAccount(accountId, newFunctionCallActionBatch);
            case MultisigStateStatus.VALID_STATE:
                return await super.signAndSendTransactionWithAccount(accountId, actions);
            case MultisigStateStatus.INVALID_STATE:
                throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState');
            default:
                throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
        }
    }
    async disableWithFAK({ contractBytes, cleanupContractBytes }) {
        let cleanupActions = [];
        if (cleanupContractBytes) {
            await this.deleteAllRequests().catch(e => e);
            cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes);
        }
        const keyConversionActions = await this.get2faDisableKeyConversionActions();
        const actions = [
            ...cleanupActions,
            ...keyConversionActions,
            transaction_1.deployContract(contractBytes)
        ];
        const accessKeyInfo = await this.findAccessKey(this.accountId, actions);
        if (accessKeyInfo && accessKeyInfo.accessKey && accessKeyInfo.accessKey.permission !== 'FullAccess') {
            throw new providers_1.TypedError(`No full access key found in keystore. Unable to bypass multisig`, 'NoFAKFound');
        }
        return this.signAndSendTransactionWithAccount(this.accountId, actions);
    }
    async get2faDisableCleanupActions(cleanupContractBytes) {
        const currentAccountState = await this.viewState('').catch(error => {
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
            transaction_1.deployContract(cleanupContractBytes),
            transaction_1.functionCall('clean', { keys: currentAccountStateKeys }, exports.MULTISIG_GAS, new bn_js_1.default('0'))
        ] : [];
    }
    async get2faDisableKeyConversionActions() {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys
            .filter(({ access_key }) => access_key.permission !== 'FullAccess')
            .filter(({ access_key }) => {
            const perm = access_key.permission.FunctionCall;
            return perm.receiver_id === accountId &&
                perm.method_names.length === 4 &&
                perm.method_names.includes('add_request_and_confirm');
        });
        const confirmOnlyKey = key_pair_1.PublicKey.from((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        return [
            transaction_1.deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => transaction_1.deleteKey(key_pair_1.PublicKey.from(public_key))),
            ...lak2fak.map(({ public_key }) => transaction_1.addKey(key_pair_1.PublicKey.from(public_key), transaction_1.fullAccessKey()))
        ];
    }
    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true}
     */
    async disable(contractBytes, cleanupContractBytes) {
        const { stateStatus } = await this.checkMultisigCodeAndStateStatus();
        if (stateStatus !== MultisigStateStatus.VALID_STATE && stateStatus !== MultisigStateStatus.STATE_NOT_INITIALIZED) {
            throw new providers_1.TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
        }
        let deleteAllRequestsError;
        await this.deleteAllRequests().catch(e => deleteAllRequestsError = e);
        const cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes).catch(e => {
            if (e.type === 'ContractHasExistingState') {
                throw deleteAllRequestsError || e;
            }
            throw e;
        });
        const actions = [
            ...cleanupActions,
            ...(await this.get2faDisableKeyConversionActions()),
            transaction_1.deployContract(contractBytes),
        ];
        console.log('disabling 2fa for', this.accountId);
        return await this.signAndSendTransaction({
            receiverId: this.accountId,
            actions
        });
    }
    async sendCodeDefault() {
        const { accountId } = this;
        const { requestId } = this.getRequest();
        const method = await this.get2faMethod();
        await this.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        });
        return requestId;
    }
    async getCodeDefault(method) {
        throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
    }
    async promptAndVerify() {
        const method = await this.get2faMethod();
        const securityCode = await this.getCode(method);
        try {
            const result = await this.verifyCode(securityCode);
            // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
            return result;
        }
        catch (e) {
            console.warn('Error validating security code:', e);
            if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                return await this.promptAndVerify();
            }
            throw e;
        }
    }
    async verifyCodeDefault(securityCode) {
        const { accountId } = this;
        const request = this.getRequest();
        if (!request) {
            throw new Error('no request pending');
        }
        const { requestId } = request;
        return await this.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }
    async getRecoveryMethods() {
        const { accountId } = this;
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId })
        };
    }
    async get2faMethod() {
        let { data } = await this.getRecoveryMethods();
        if (data && data.length) {
            data = data.find((m) => m.kind.indexOf('2fa-') === 0);
        }
        if (!data)
            return null;
        const { kind, detail } = data;
        return { kind, detail };
    }
    async signatureFor() {
        const { accountId } = this;
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockNumber = block.header.height.toString();
        const signed = await this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, this.connection.networkId);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }
    async postSignedJson(path, body) {
        return await web_1.fetchJson(this.helperUrl + path, JSON.stringify({
            ...body,
            ...(await this.signatureFor())
        }));
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
