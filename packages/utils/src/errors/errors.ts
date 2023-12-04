import { Logger } from '../logger';

/** @deprecated */
export function logWarning(...args: any[]): void {
    const [message, ...optinalParams] = args;
    Logger.warn(message, ...optinalParams);
}
