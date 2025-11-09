import { afterEach, beforeEach, describe, expect, jest, test } from "bun:test";
import { fetchJsonRpc, ProviderError, retryConfig } from "../src/fetch_json.js";

describe("fetchJsonError", () => {
    const RPC_URL = "https://rpc.testnet.near.org";
    const statusRequest = {
        jsonrpc: "2.0",
        id: 1,
        method: "status",
        params: [],
    };
    let originalFetch: typeof globalThis.fetch;
    let mockFetch: jest.Mock;

    beforeEach(() => {
        // Store original fetch
        originalFetch = globalThis.fetch;
        // Mock fetch with default resolved value
        mockFetch = jest.fn().mockResolvedValue(new Response());
        globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;
    });

    afterEach(() => {
        // Restore original fetch
        globalThis.fetch = originalFetch;
    });

    test("handles 500 Internal Server Error", async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        mockFetch.mockImplementation(() =>
            Promise.resolve(new Response("", { status: 500 }))
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())
        ).rejects.toThrowError(
            new ProviderError("Internal server error", { cause: 500 })
        );
    });

    test("handles 408 Timeout Error", async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        mockFetch.mockImplementation(() =>
            Promise.resolve(new Response("", { status: 408 }))
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())
        ).rejects.toThrowError(
            new ProviderError("Timeout error", { cause: 408 })
        );
    });

    test("handles 400 Request Validation Error", async () => {
        mockFetch.mockResolvedValue(new Response("", { status: 400 }));

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())
        ).rejects.toThrowError(
            new ProviderError("Request validation error", { cause: 400 })
        );
    });

    test("handles 503 Service Unavailable", async () => {
        // Return a new Response each time to avoid "Body already used" error during retries
        mockFetch.mockImplementation(() =>
            Promise.resolve(new Response("", { status: 503 }))
        );

        await expect(
            fetchJsonRpc(RPC_URL, statusRequest, {}, retryConfig())
        ).rejects.toThrowError(
            new ProviderError(`${RPC_URL} unavailable`, { cause: 503 })
        );
    });
});
