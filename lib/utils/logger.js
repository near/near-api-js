"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = exports.LogLevel = exports.setLogger = exports.getLogger = exports.setLogLevel = void 0;
const depd_1 = __importDefault(require("depd"));
let logger;
exports.setLogLevel = (logLevel) => {
    if (!logger)
        exports.setLogger(new DefaultLogger());
    logger.setLogLevel(logLevel);
};
exports.getLogger = () => {
    if (!logger)
        exports.setLogger(new DefaultLogger);
    return logger;
};
exports.setLogger = (newLogger) => logger = newLogger;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["NONE"] = 5] = "NONE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * The default logger uses console.* to log messages
 */
class DefaultLogger {
    constructor(logLevel = LogLevel.WARN) {
        this.logLevel = logLevel;
    }
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }
    deprecate(moduleName, msg) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const deprecate = depd_1.default(moduleName);
            deprecate(msg);
        }
    }
    debug(...msg) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(...msg);
        }
    }
    info(...msg) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(...msg);
        }
    }
    warn(...msg) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(...msg);
        }
    }
    error(...msg) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(...msg);
        }
    }
    shouldLog(level) {
        return this.logLevel <= level;
    }
}
exports.DefaultLogger = DefaultLogger;
