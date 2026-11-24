import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { exponentialBackoff } from '../../../src/providers/exponential-backoff.js';

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

test('returns null right after the last attempt without an extra sleep', async () => {
    const callTimes: number[] = [];
    const start = Date.now();
    const promise = exponentialBackoff(100, 3, 2, async () => {
        callTimes.push(Date.now() - start);
        return null;
    });

    // Calls happen at 0ms, 100ms and 300ms; nothing should be pending after that.
    await vi.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toBeNull();
    expect(callTimes).toEqual([0, 100, 300]);
    expect(vi.getTimerCount()).toBe(0);
});

test('returns the first truthy result', async () => {
    let calls = 0;
    const promise = exponentialBackoff(100, 3, 2, async () => (++calls === 2 ? 'done' : null));
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe('done');
    expect(calls).toBe(2);
});
