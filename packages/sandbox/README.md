# @near-js/sandbox

`@near-js/sandbox` provides a lightweight, zero-dependency wrapper around the NEAR Sandbox binary so every test can spin up a deterministic local NEAR node without relying on `near-workspaces`.

## What this package does

1. Downloads the correct `near-sandbox` binary for your platform (Linux / macOS, x86_64 or arm64)
2. Initializes a temporary NEAR home directory if needed and starts the sandbox subprocess
3. Exposes the RPC endpoint and root account credentials so your tests can talk to the node directly through `@near-js/accounts / @near-js/providers`
4. Stops the process and cleans up when you are done

There are no abstractions on top of `@near-js/accounts` — you keep full control over how you exercise the RPC using the actual production clients.

## Installation

```bash
bun add -D @near-js/sandbox
```

## Quick start

```ts
import { ensureSandbox, stopSandbox } from "@near-js/sandbox";
import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";

const { server, keyPair } = await ensureSandbox();

const provider = new JsonRpcProvider({ url: server.endpoint });
const signer = KeyPairSigner.fromSecretKey(keyPair.secret_key);
const account = new Account(
    {
        provider,
        networkId: "sandbox",
        signer,
    },
    keyPair.account_id
);

const balance = await account.getBalance();
console.log(balance.total);

await stopSandbox();
```

## Test setup

Because the sandbox is just an RPC endpoint with a funded root account, you can reuse your existing helpers:

```ts
import { beforeAll, afterAll } from "bun:test";
import { ensureSandbox, stopSandbox } from "@near-js/sandbox";

let sandboxInfo;

beforeAll(async () => {
    sandboxInfo = await ensureSandbox();
});

afterAll(async () => {
    await stopSandbox();
});

// now reuse sandboxInfo.rpcUrl + sandboxInfo.rootAccountId
```

## API

### `ensureSandbox(options?: SandboxOptions): Promise<SandboxInstance>`

-   `options.version` – sandbox release (default: `2.9.0`)
-   `options.port` – RPC port (default comes from the manager)
-   `options.homeDir` – custom filesystem root for the sandbox state

Returns the running instance plus the root account key:

```ts
interface SandboxInstance {
    server: SandboxManager;
    keyPair: {
        account_id: string;
        secret_key: string;
        private_key?: string;
    };
}
```

### `stopSandbox(): Promise<void>`

Stops the currently running sandbox and prevents the singleton from restarting.

### `getSandboxInfo(): Promise<SandboxInfo | null>`

Returns the current RPC endpoint and credentials if the sandbox is running.

### `SandboxManager`

A low-level class for users who want direct control. Properties:

| Property        | Description                                   |
| --------------- | --------------------------------------------- |
| `endpoint`      | `${rpcUrl}`                                   |
| `rootAccountId` | Validator account ID (`test.near` by default) |
| `secretKey`     | Secret key string                             |

Methods:

```ts
const manager = new SandboxManager({ version: "2.9.0", port: 5001 });
await manager.start();
await manager.stop();
```

## Binary download

Binaries are cached per-version under `~/.near-js/sandbox/bin`. The downloader:

-   Removes the top-level directory from the tarball when extracting
-   Keeps a versioned executable (e.g., `near-sandbox-2.9.0`)
-   Sets executable permissions automatically

## Removing `near-workspaces`

This package replaces the previously required `near-workspaces` dependency. Your tests can now:

1. Start the binary via `@near-js/sandbox`
2. Construct `JsonRpcProvider` / `Account` instances pointed at the sandbox endpoint
3. Deploy contracts and send transactions using real `@near-js/*` APIs

That keeps the test tooling aligned exactly with what runs in production.

## License

MIT
