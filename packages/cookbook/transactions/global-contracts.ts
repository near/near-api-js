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

    // Deploy a global contract by account ID (updateable by owner)
    const deployResult = await account.deployGlobalContract(contractCode, "accountId");
    console.log("Global contract deployed:", deployResult);

    // Deploy an immutable global contract by code hash
    const deployResultImmutable = await account.deployGlobalContract(contractCode, "codeHash");
    console.log("Immutable global contract deployed:", deployResultImmutable);

    // Use a global contract by account ID
    const useResult = await account.useGlobalContract({ accountId: "contract-owner.testnet" });
    console.log("Using global contract by account ID:", useResult);

    // Use a global contract by code hash (Uint8Array)
    const codeHash = new Uint8Array(32); // 32-byte hash placeholder
    const useResultByHash = await account.useGlobalContract({ codeHash });
    console.log("Using global contract by hash:", useResultByHash);

    // Use a global contract by code hash (hex string)
    const codeHashHex = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    const useResultByHexHash = await account.useGlobalContract({ codeHash: codeHashHex });
    console.log("Using global contract by hex hash:", useResultByHexHash);
}