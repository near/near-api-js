import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";

export default async function globalContracts() {
    const provider = new JsonRpcProvider({
        url: "https://rpc.testnet.near.org",
    });

    const secretKey = "ed25519:..."
    const accountId = "global-contracts.testnet"

    const signer = KeyPairSigner.fromSecretKey(secretKey)
    const account = new Account(accountId, provider, signer)

    // Example contract code (placeholder - replace with actual compiled WASM)
    const contractCode = new Uint8Array([0x00, 0x61, 0x73, 0x6d]); // WASM header as example

    // ============================================================================
    // NEW ERGONOMIC API (Recommended)
    // ============================================================================

    // Publish an immutable global contract (identified by code hash)
    const publishResultImmutable = await account.publishContract(contractCode);
    console.log("Immutable global contract published:", publishResultImmutable);

    // Publish a mutable global contract (identified by account, can be updated)
    const publishResultMutable = await account.publishContract(contractCode, accountId);
    console.log("Mutable global contract published:", publishResultMutable);

    // Deploy from published code using account ID
    const deployFromAccount = await account.deployFromPublished({ accountId: "contract-owner.testnet" });
    console.log("Deployed from account ID:", deployFromAccount);

    // Deploy from published code using code hash (Uint8Array)
    const codeHash = new Uint8Array(32); // 32-byte hash placeholder
    const deployFromHash = await account.deployFromPublished({ codeHash });
    console.log("Deployed from hash (Uint8Array):", deployFromHash);

    // Deploy from published code using code hash (hex string)
    const codeHashHex = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    const deployFromHexHash = await account.deployFromPublished({ codeHash: codeHashHex });
    console.log("Deployed from hash (hex string):", deployFromHexHash);

    // ============================================================================
    // OLD API (Deprecated - shown for reference)
    // ============================================================================

    // Deploy a global contract by account ID (updateable by owner)
    // DEPRECATED: Use publishContract(contractCode, accountId) instead
    const deployResult = await account.deployGlobalContract(contractCode, "accountId");
    console.log("Global contract deployed (old API):", deployResult);

    // Deploy an immutable global contract by code hash
    // DEPRECATED: Use publishContract(contractCode) instead
    const deployResultImmutable = await account.deployGlobalContract(contractCode, "codeHash");
    console.log("Immutable global contract deployed (old API):", deployResultImmutable);

    // Use a global contract by account ID
    // DEPRECATED: Use deployFromPublished("contract-owner.testnet") instead
    const useResult = await account.useGlobalContract({ accountId: "contract-owner.testnet" });
    console.log("Using global contract by account ID (old API):", useResult);

    // Use a global contract by code hash (Uint8Array)
    // DEPRECATED: Use deployFromPublished(codeHash) instead
    const useResultByHash = await account.useGlobalContract({ codeHash });
    console.log("Using global contract by hash (old API):", useResultByHash);

    // Use a global contract by code hash (hex string)
    // DEPRECATED: Use deployFromPublished(codeHashHex) instead
    const useResultByHexHash = await account.useGlobalContract({ codeHash: codeHashHex });
    console.log("Using global contract by hex hash (old API):", useResultByHexHash);
}