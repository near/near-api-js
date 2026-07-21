/**
 * Minimal browser replacement for the `util.format` API used by borsh's
 * schema compiler. Keeping this local avoids pulling a Node polyfill into the
 * IIFE bundle.
 */
export function format(template: unknown, ...values: unknown[]): string {
    if (typeof template !== 'string') {
        return [template, ...values].map(stringify).join(' ');
    }

    let valueIndex = 0;
    const result = template.replace(/%[sdj%]/g, (placeholder) => {
        if (placeholder === '%%') return '%';
        const value = values[valueIndex++];

        switch (placeholder) {
            case '%d':
                return String(Number(value));
            case '%j':
                return json(value);
            default:
                return stringify(value);
        }
    });

    const remaining = values.slice(valueIndex).map(stringify);
    return remaining.length > 0 ? `${result} ${remaining.join(' ')}` : result;
}

function json(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return '[Circular]';
    }
}

function stringify(value: unknown): string {
    return typeof value === 'string' ? value : json(value);
}
