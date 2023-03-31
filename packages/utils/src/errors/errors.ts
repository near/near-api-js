export function logWarning(...args: any[]): void {
    if (!process.env['NEAR_NO_LOGS']){
        console.warn(...args);
    }
}
