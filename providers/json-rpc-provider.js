'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = require("./provider");
var web_1 = require("../utils/web");
var properties_1 = require("../utils/properties");
var serialize_1 = require("../utils/serialize");
var DEFAULT_RPC_URL = 'http://localhost:3030';
/// Keep ids unique across all connections.
var _nextId = 123;
var JsonRpcProvider = /** @class */ (function (_super) {
    __extends(JsonRpcProvider, _super);
    function JsonRpcProvider(url, network) {
        var _this = _super.call(this) || this;
        // TODO: resolve network to url...
        if (!url) {
            url = DEFAULT_RPC_URL;
        }
        _this.connection = { url: url };
        return _this;
    }
    JsonRpcProvider.prototype.getNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        name: "test",
                        chainId: "test"
                    }];
            });
        });
    };
    JsonRpcProvider.prototype.sendTransaction = function (signedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, properties_1.resolveProperties({ signedTransaction: signedTransaction })];
                    case 1:
                        transaction = (_a.sent()).transaction;
                        return [4 /*yield*/, this.sendJsonRpc("broadcast_tx_commit", [serialize_1.base_encode(transaction)])];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response)];
                }
            });
        });
    };
    JsonRpcProvider.prototype.query = function (path, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendJsonRpc("query", [path, data])];
            });
        });
    };
    JsonRpcProvider.prototype.sendJsonRpc = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = {
                    method: method,
                    params: params,
                    id: (_nextId++),
                    jsonrpc: "2.0"
                };
                return [2 /*return*/, web_1.fetchJson(this.connection, JSON.stringify(request))];
            });
        });
    };
    return JsonRpcProvider;
}(provider_1.Provider));
exports.JsonRpcProvider = JsonRpcProvider;
