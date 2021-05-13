export declare const setLogLevel: (logLevel: LogLevel) => void;
export declare const getLogger: () => Logger;
export declare const setLogger: (newLogger: any) => any;
export declare enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    NONE = 5
}
/**
 * The Logger interface is used to specify how information is logged
 * @see {DefaultLogger}
 */
export interface Logger {
    setLogLevel(LogLevel: any): void;
    deprecate(moduleName: string, msg: string): void;
    debug(...msg: any[]): void;
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
}
/**
 * The default logger uses console.* to log messages
 */
export declare class DefaultLogger implements Logger {
    private logLevel;
    constructor(logLevel?: LogLevel);
    setLogLevel(logLevel: LogLevel): void;
    deprecate(moduleName: string, msg: string): void;
    debug(...msg: any[]): void;
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
    private shouldLog;
}
