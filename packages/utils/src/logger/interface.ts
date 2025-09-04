export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

/** @deprecated Will be removed in the next major release */
export interface LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]): any;

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]): any;

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]): any;

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]): any;

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]): any;

    /**
     * Write a 'fatal' level log.
     */
    fatal?(message: any, ...optionalParams: any[]): any;
}
