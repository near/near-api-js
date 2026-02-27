/**
 * Minimal browser shim for Node's `util.format()`.
 * Only dependency: `generate-function` (used by `is-my-json-valid`).
 */
export function format(fmt: unknown, ...args: unknown[]): string {
    if (typeof fmt !== 'string') return String(fmt);
    let i = 0;
    return fmt.replace(/%[sdj%]/g, (match) => {
        if (match === '%%') return '%';
        if (i >= args.length) return match;
        const arg = args[i++];
        if (match === '%j') {
            try { return JSON.stringify(arg); } catch { return '[Circular]'; }
        }
        return String(arg);
    });
}

export default { format };
