export function logWarning(...args: any[]): void {
    if (!(typeof process === 'object' && process.env['NEAR_NO_LOGS'])){
        console.warn(...args);
    }
}
