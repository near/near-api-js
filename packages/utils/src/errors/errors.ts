export function logWarning(...args: any[]): void {
    if (typeof process !== 'undefined' && !process.env['NEAR_NO_LOGS']) {
        console.warn(...args);
    }
}
