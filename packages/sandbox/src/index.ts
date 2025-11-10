import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import * as tar from 'tar';

const DEFAULT_VERSION = '2.9.0';
const BINARY_NAME = 'near-sandbox';
const ARCHIVE_NAME = 'near-sandbox.tar.gz';
const DOWNLOAD_BASE =
    'https://s3-us-west-1.amazonaws.com/build.nearprotocol.com/nearcore';
const MIN_PORT = 5001;
const MAX_PORT = 60000;
const STARTUP_TIMEOUT = 60000;
const DOWNLOAD_TIMEOUT = 120000;

export interface SandboxOptions {
    version?: string;
    port?: number;
    homeDir?: string;
    rm?: boolean;
}

export interface SandboxInfo {
    rpcUrl: string;
    rootAccountId: string;
    secretKey: string;
}

interface PlatformInfo {
    system: string;
    arch: string;
}

/**
 * Get platform identifier for downloading correct binary
 */
function getPlatformId(): PlatformInfo {
    const system = os.platform();
    const arch = os.arch();

    const platform = system === 'darwin' ? 'Darwin' : 'Linux';
    const normalizedArch = arch === 'x64' ? 'x86_64' : arch;

    if (!['x86_64', 'arm64'].includes(normalizedArch)) {
        throw new Error(`Unsupported architecture: ${arch}`);
    }

    if (system !== 'darwin' && system !== 'linux') {
        throw new Error(`Unsupported platform: ${system}`);
    }

    return { system: platform, arch: normalizedArch };
}

/**
 * Get directory for storing sandbox binaries
 */
function getBinaryDir(): string {
    const dir = path.join(os.homedir(), '.near-js', 'sandbox', 'bin');
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}

/**
 * Download and extract sandbox binary
 */
async function downloadBinary(version: string): Promise<string> {
    const { system, arch } = getPlatformId();
    const destDir = getBinaryDir();
    const filename = `${BINARY_NAME}-${version}`;
    const dest = path.join(destDir, filename);

    // Return if already exists
    if (fs.existsSync(dest)) {
        return dest;
    }

    const url = `${DOWNLOAD_BASE}/${system}-${arch}/${version}/${ARCHIVE_NAME}`;
    const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'near-sandbox-'),
    );

    try {
        const archivePath = path.join(tmpDir, ARCHIVE_NAME);

        // Download with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(
                    `Download failed: ${response.status} ${response.statusText}`,
                );
            }

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const stream = fs.createWriteStream(archivePath);
            await pipeline(Readable.fromWeb(response.body as any), stream);
        } finally {
            clearTimeout(timeout);
        }

        // Extract archive (strip=1 removes top-level directory)
        await tar.x({ file: archivePath, cwd: tmpDir, strip: 1 });

        const extracted = path.join(tmpDir, BINARY_NAME);
        if (!fs.existsSync(extracted)) {
            throw new Error(`Binary ${BINARY_NAME} not found in archive`);
        }

        // Move to final location and make executable
        await mkdir(path.dirname(dest), { recursive: true });
        await fs.promises.rename(extracted, dest);
        await fs.promises.chmod(dest, 0o755);

        return dest;
    } catch (error) {
        await rm(tmpDir, { recursive: true, force: true });
        throw new Error(`Failed to download binary from ${url}: ${error}`);
    }
}

/**
 * Cached binary path
 */
let cachedBinaryPath: string | undefined;

/**
 * Ensure binary is available and return its path
 */
async function ensureBinary(version: string): Promise<string> {
    if (cachedBinaryPath) {
        return cachedBinaryPath;
    }
    cachedBinaryPath = await downloadBinary(version || DEFAULT_VERSION);
    return cachedBinaryPath;
}

/**
 * Check if a port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const server = createServer();

        server.once('error', () => {
            resolve(false);
        });

        server.once('listening', () => {
            server.close();
            resolve(true);
        });

        server.listen(port, '0.0.0.0');
    });
}

/**
 * Find an available port in the specified range
 */
async function findAvailablePort(
    start = MIN_PORT,
    end = MAX_PORT,
): Promise<number> {
    const range = end - start + 1;
    const tries = 16;
    for (let i = 0; i < tries; i++) {
        const port = start + Math.floor(Math.random() * range);
        if (await isPortAvailable(port)) {
            return port;
        }
    }

    for (let port = start; port <= end; port++) {
        if (await isPortAvailable(port)) {
            return port;
        }
    }

    throw new Error(`No available ports found in range ${start}-${end}`);
}

/**
 * Ping sandbox RPC endpoint to check if it's ready
 */
async function pingRpc(url: string, timeoutMs = 1000): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'status',
                method: 'status',
                params: [],
            }),
            signal: controller.signal,
        });
        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * Singleton instance
 */
let currentInstance: SandboxManager | null = null;

/**
 * Manages a NEAR sandbox instance
 */
export class SandboxManager {
    port: number;
    homeDir: string;
    version: string;
    rm: boolean;
    process?: ChildProcess;
    rpcUrl?: string;
    rootAccountId?: string;
    secretKey?: string;

    constructor(options: SandboxOptions = {}) {
        this.port = options.port ?? 3030;
        this.homeDir =
            options.homeDir ??
            path.join(os.tmpdir(), `near-sandbox-${process.pid}-${Date.now()}`);
        this.version = options.version ?? DEFAULT_VERSION;
        this.rm = options.rm ?? true;
    }

    get endpoint(): string {
        return this.rpcUrl ?? `http://127.0.0.1:${this.port}`;
    }

    /**
     * Start the sandbox
     */
    async start(): Promise<void> {
        if (this.process) {
            return;
        }

        const binary = await ensureBinary(this.version);

        // Auto-detect available port if specified one is unavailable
        if (!(await isPortAvailable(this.port))) {
            this.port = await findAvailablePort();
        }

        // Ensure network port is also available
        const networkPort = this.port + 1;
        if (!(await isPortAvailable(networkPort))) {
            this.port = await findAvailablePort();
        }

        // Create home directory
        await mkdir(this.homeDir, { recursive: true });

        // Initialize sandbox
        await this.runInit(binary);

        // Load validator key
        await this.loadValidatorKey();

        // Start sandbox process
        await this.startProcess(binary);

        // Wait for RPC to be ready
        await this.waitForReady();
    }

    /**
     * Stop the sandbox and cleanup
     */
    async stop(): Promise<void> {
        if (!this.process?.pid) {
            return;
        }

        const pid = this.process.pid;

        // Kill process (try process group first for detached processes, then direct)
        try {
            // For detached processes, kill the whole process group
            process.kill(-pid, 'SIGTERM');
            // Give it a moment to cleanup gracefully
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch {
            // Process group might not exist, try direct kill
            try {
                process.kill(pid, 'SIGTERM');
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch {
                // Try SIGKILL as last resort
                try {
                    process.kill(pid, 'SIGKILL');
                } catch {
                    // Process already dead
                }
            }
        }

        this.process = undefined;

        // Clean up home directory
        if (this.rm) {
            try {
                await rm(this.homeDir, { recursive: true, force: true });
            } catch {
                // Ignore cleanup errors
            }
        }
    }

    /**
     * Run sandbox init command
     */
    private async runInit(binary: string): Promise<void> {
        const args = ['--home', this.homeDir, 'init', '--chain-id', 'localnet'];

        return new Promise((resolve, reject) => {
            const child = spawn(binary, args, { stdio: 'pipe' });
            let stderr = '';

            child.stderr?.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(
                        new Error(
                            `Sandbox init failed with code ${code}: ${stderr}`,
                        ),
                    );
                }
            });

            child.on('error', reject);
        });
    }

    /**
     * Load validator key from sandbox home directory
     */
    private async loadValidatorKey(): Promise<void> {
        const keyPath = path.join(this.homeDir, 'validator_key.json');

        try {
            const data = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
            this.rootAccountId = data.account_id;
            this.secretKey = data.secret_key ?? data.private_key;
        } catch (error) {
            throw new Error(
                `Failed to read validator key from ${keyPath}: ${error}`,
            );
        }
    }

    /**
     * Start sandbox process
     */
    private async startProcess(binary: string): Promise<void> {
        const networkPort = this.port + 1;

        this.process = spawn(
            binary,
            [
                '--home',
                this.homeDir,
                'run',
                '--rpc-addr',
                `0.0.0.0:${this.port}`,
                '--network-addr',
                `0.0.0.0:${networkPort}`,
            ],
            {
                detached: true,
                stdio: 'ignore',
            },
        );

        if (!this.process.pid) {
            throw new Error('Failed to start sandbox: no PID');
        }

        this.process.unref();
        this.rpcUrl = `http://127.0.0.1:${this.port}`;
    }

    /**
     * Wait for sandbox to be ready
     */
    private async waitForReady(timeout = STARTUP_TIMEOUT): Promise<void> {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            if (await pingRpc(this.endpoint)) {
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        throw new Error(`Sandbox failed to start within ${timeout}ms`);
    }
}

/**
 * Start sandbox (singleton pattern)
 */
export async function startSandbox(
    options?: SandboxOptions,
): Promise<SandboxManager> {
    if (!currentInstance) {
        currentInstance = new SandboxManager(options);
    }
    await currentInstance.start();
    return currentInstance;
}

/**
 * Stop sandbox
 */
export async function stopSandbox(): Promise<void> {
    if (currentInstance) {
        await currentInstance.stop();
        currentInstance = null;
    }
}

/**
 * Ensure sandbox is running (singleton pattern)
 * Returns server instance and validator key pair
 */
export async function ensureSandbox(options?: SandboxOptions) {
    if (!currentInstance) {
        currentInstance = new SandboxManager(options);
    }
    await currentInstance.start();

    return {
        server: currentInstance,
        keyPair: {
            account_id: currentInstance.rootAccountId ?? 'test.near',
            secret_key: currentInstance.secretKey ?? '',
        },
    };
}

/**
 * Get current sandbox info
 */
export async function getSandboxInfo(): Promise<SandboxInfo | null> {
    if (!currentInstance) {
        return null;
    }

    return {
        rpcUrl: currentInstance.endpoint,
        rootAccountId: currentInstance.rootAccountId ?? 'test.near',
        secretKey: currentInstance.secretKey ?? '',
    };
}

/**
 * Create a fresh sandbox manager (does not affect the singleton).
 */
export async function createSandboxInstance(
    options?: SandboxOptions,
): Promise<SandboxManager> {
    const manager = new SandboxManager(options);
    await manager.start();
    return manager;
}

/**
 * Convenience helper: start a fresh sandbox and return the manager plus its root credentials.
 */
export async function createSandboxInfo(options?: SandboxOptions) {
    const manager = await createSandboxInstance(options);
    return {
        server: manager,
        keyPair: {
            account_id: manager.rootAccountId ?? 'test.near',
            secret_key: manager.secretKey ?? '',
        },
    };
}
