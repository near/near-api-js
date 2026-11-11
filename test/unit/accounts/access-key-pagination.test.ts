import { expect, test, vi } from 'vitest';
import { Account, JsonRpcProvider } from '../../../src/index.js';

test('getAccessKeyList preserves the unpaginated request when called without options', async () => {
    const provider = new JsonRpcProvider({ url: 'http://unused' });
    const page = { keys: [], block_hash: 'block', block_height: 42 };
    const query = vi.spyOn(provider, 'query').mockResolvedValue(page);
    const account = new Account('example.near', provider);

    expect(await account.getAccessKeyList()).toBe(page);
    expect(query).toHaveBeenCalledExactlyOnceWith({
        request_type: 'view_access_key_list',
        account_id: 'example.near',
        finality: 'optimistic',
    });
});

test('getAccessKeyList exposes the page cursor and forwards it unchanged to the next request', async () => {
    const provider = new JsonRpcProvider({ url: 'http://unused' });
    const firstPage = { keys: [], last_key: 'ml-dsa-65-hash:cursor', block_hash: 'block', block_height: 42 };
    const lastPage = { keys: [], block_hash: 'block', block_height: 42 };
    const query = vi.spyOn(provider, 'query').mockResolvedValueOnce(firstPage).mockResolvedValueOnce(lastPage);
    const account = new Account('example.near', provider);

    const page = await account.getAccessKeyList({ limit: 100 });
    expect(page).toBe(firstPage);
    expect(await account.getAccessKeyList({ limit: 100, afterKey: page.last_key! })).toBe(lastPage);
    expect(query).toHaveBeenNthCalledWith(1, {
        request_type: 'view_access_key_list',
        account_id: 'example.near',
        finality: 'optimistic',
        limit: 100,
    });
    expect(query).toHaveBeenNthCalledWith(2, {
        request_type: 'view_access_key_list',
        account_id: 'example.near',
        finality: 'optimistic',
        limit: 100,
        after_key: 'ml-dsa-65-hash:cursor',
    });
});
