// Browser shim for Node's 'util' module.
// Used by is-my-json-valid which only needs util.format for error messages.

function format(fmt: string, ...args: unknown[]): string {
    let i = 0;
    return fmt.replace(/%[sdj%]/g, (match) => {
        if (match === '%%') return '%';
        if (i >= args.length) return match;
        const val = args[i++];
        switch (match) {
            case '%s':
                return String(val);
            case '%d':
                return String(Number(val));
            case '%j':
                try {
                    return JSON.stringify(val);
                } catch {
                    return '[Circular]';
                }
            default:
                return String(val);
        }
    });
}

export { format };
export default { format };
