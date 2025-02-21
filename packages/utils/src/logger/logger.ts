import { ConsoleLogger } from './console.logger';
import type { LogLevel, LoggerService } from './interface';

const DEFAULT_LOG_LEVELS: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];

const DEFAULT_LOGGER = new ConsoleLogger(DEFAULT_LOG_LEVELS);

/**
 * Used to log the library messages
 */
export class Logger {
    protected static instanceRef?: LoggerService = DEFAULT_LOGGER;

    public static overrideLogger = (logger?: LoggerService): void => {
        this.instanceRef = logger;
    };

    /**
     * Write an 'error' level log.
     */
    public static error(message: any, stack?: string): void;
    public static error(message: any, ...optionalParams: [string, ...any[]]): void;
    public static error(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.error(message, ...optionalParams);
    }

    /**
     * Write a 'log' level log.
     */
    public static log(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.log(message, ...optionalParams);
    }

    /**
     * Write a 'warn' level log.
     */
    public static warn(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.warn(message, ...optionalParams);
    }

    /**
     * Write a 'debug' level log.
     */
    public static debug(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.debug?.(message, ...optionalParams);
    }

    /**
     * Write a 'verbose' level log.
     */
    public static verbose(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.verbose?.(message, ...optionalParams);
    }

    /**
     * Write a 'fatal' level log.
     */
    public static fatal(message: any, stack?: string): void;
    public static fatal(message: any, ...optionalParams: [string, ...any[]]): void;
    public static fatal(message: any, ...optionalParams: any[]) {
        Logger.instanceRef?.fatal?.(message, ...optionalParams);
    }
}
