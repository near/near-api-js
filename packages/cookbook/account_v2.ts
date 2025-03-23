import { ContractV2, PublicAccountV2 } from "near-api-js/lib/account";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { KeyPairSigner } from "near-api-js/lib/signer";
import { KeyPair } from "@near-js/crypto";

async function main(): Promise<void> {
    const provider = new JsonRpcProvider({
        url: "https://test.rpc.fastnear.com",
    });

    const account = new PublicAccountV2("denbite.testnet", provider);

    const info = await account.getInformation();

    console.log("info", info);

    await account.getAccessKeys();

    // ----------------------------------------------

    // use real key here
    const key = KeyPair.fromRandom("ED25519");
    const signer = new KeyPairSigner([key], provider);

    const signerAccount = account.intoSignerAccount(signer);

    await signerAccount.transfer("guille.testnet", 1_000_000_000n);

    const code = new Uint8Array();
    await signerAccount.deployContract(code);

    await signerAccount.addFullAccessKey(
        KeyPair.fromRandom("ED25519").getPublicKey()
    );

    await signerAccount.deleteAccount("guille.testnet");

    // ----------------------------------------------

    // or account.intoContract()
    const contract = new ContractV2("ref-finance.testnet", provider);

    await contract.callReadFunction("tokens_by_owner", {
        owner_id: signerAccount.accountId,
    });

    await contract.callWriteFunction(
        signerAccount,
        "swap_token",
        {
            token_in: "usdt.testnet",
            amount_in: 1_000_000_000,
            token_out: "wrap.testnet",
        },
        1n, // deposit 1 yoctoNear
        100_000_000_000n // 100 TGas
    );
}

main();
