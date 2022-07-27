"use strict";
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
exports.fetchJson = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const exponential_backoff_1 = __importDefault(require("./exponential-backoff"));
const providers_1 = require("../providers");
const errors_1 = require("./errors");
const START_WAIT_TIME_MS = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
function fetchJson(connectionInfoOrUrl, json) {
    return __awaiter(this, void 0, void 0, function* () {
        let connectionInfo = { url: null };
        if (typeof (connectionInfoOrUrl) === 'string') {
            connectionInfo.url = connectionInfoOrUrl;
        }
        else {
            connectionInfo = connectionInfoOrUrl;
        }
        const response = yield (0, exponential_backoff_1.default)(START_WAIT_TIME_MS, RETRY_NUMBER, BACKOFF_MULTIPLIER, () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(connectionInfo.url, {
                    method: json ? 'POST' : 'GET',
                    body: json ? json : undefined,
                    headers: Object.assign(Object.assign({}, connectionInfo.headers), { 'Content-Type': 'application/json' })
                });
                if (!response.ok) {
                    if (response.status === 503) {
                        (0, errors_1.logWarning)(`Retrying HTTP request for ${connectionInfo.url} as it's not available now`);
                        return null;
                    }
                    throw (0, http_errors_1.default)(response.status, yield response.text());
                }
                return response;
            }
            catch (error) {
                if (error.toString().includes('FetchError') || error.toString().includes('Failed to fetch')) {
                    (0, errors_1.logWarning)(`Retrying HTTP request for ${connectionInfo.url} because of error: ${error}`);
                    return null;
                }
                throw error;
            }
        }));
        if (!response) {
            throw new providers_1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${connectionInfo.url}.`, 'RetriesExceeded');
        }
        return yield response.json();
    });
}
exports.fetchJson = fetchJson;
