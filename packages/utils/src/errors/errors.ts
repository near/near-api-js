import { Logger } from '../logger';

/** @deprecated */
export function logWarning(...args: any[]): void {
    const [message, ...optionalParams] = args;
    Logger.warn(message, ...optionalParams);
}
