import type { LoggerService, LogLevel } from './interface.js';

/**
 * @deprecated Will be removed in the next major release
 */
export class ConsoleLogger implements LoggerService {
    public constructor(protected readonly logLevels: LogLevel[]) {}

    public isLevelEnabled = (level: LogLevel): boolean => {
        return this.logLevels.includes(level);
    };

    private print(
        level: LogLevel,
        message: any,
        ...optionalParams: any[]
    ): void {
        switch (level) {
            case 'error':
            case 'fatal':
                console.error(message, ...optionalParams);
                break;
            case 'warn':
                console.warn(message, ...optionalParams);
                break;
            case 'log':
                console.log(message, ...optionalParams);
                break;
            case 'debug':
            case 'verbose':
                console.debug(message, ...optionalParams);
                break;
        }
    }

    verbose(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('verbose')) return;

        this.print('verbose', message, ...optionalParams);
    }

    debug(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('debug')) return;

        this.print('debug', message, ...optionalParams);
    }

    log(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('log')) return;

        this.print('log', message, ...optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('warn')) return;

        this.print('warn', message, ...optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('error')) return;

        this.print('error', message, ...optionalParams);
    }

    fatal(message: any, ...optionalParams: any[]) {
        if (!this.isLevelEnabled('fatal')) return;

        this.print('fatal', message, ...optionalParams);
    }
}
