import { PublicKey, type Signature as PublicKeySignature } from '@near-js/crypto';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import { JsonRpcProvider, Provider } from '@near-js/providers';
import { InMemorySigner } from '@near-js/signers';
import {
  DelegateAction,
  encodeDelegateAction, Signature,
  Signature as TxSignature, SignedDelegate,
  SignedTransaction,
  Transaction,
} from '@near-js/transactions';
import type {
  BlockReference,
  FinalExecutionOutcome,
  FinalExecutionStatus,
  QueryResponseKind,
} from '@near-js/types';
import { parseBalance, parseResultError } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';
import * as path from 'node:path';
import * as os from 'node:os';

import { ACCOUNT_CREATION_DEPOSIT, DEFAULT_FILESYSTEM_KEYSTORE_PATH, MAINNET_RPC_URL, TESTNET_RPC_URL } from './constants';
import { Viewer } from './viewer';
import { TransactionComposer } from './transactions';
import type { CallOptions, ViewOptions } from './types';

interface ConstructorParams {
  network: string;
}

export class NearClient {
  private network: string;
  private rpcProvider: Provider = null;
  private getSigningPublicKey: () => Promise<PublicKey>;
  private signMessage: (message: Uint8Array) => Promise<PublicKeySignature> = () => new Promise((_, rej) => rej('SignerNotInitialized'));
  private signingAccountId: string;

  constructor({ network }: ConstructorParams = { network: 'mainnet' }) {
    this.network = network;
    if (network === 'mainnet') {
      this.withMainnetRpc();
    } else if (network === 'testnet') {
      this.withTestnetRpc();
    }
  }

  async call(contractId: string, method: string, args: object, options?: CallOptions): Promise<FinalExecutionOutcome> {
    const transaction = (await this.initTransaction(contractId))
      .functionCall(method, args, options?.gas, options?.deposit)
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  async createAccount(accountId: string, publicKey: PublicKey | string, options?: CallOptions): Promise<FinalExecutionOutcome> {
    const rootContract = this.network === 'testnet' ? 'testnet' : 'near';
    const transaction = (await this.initTransaction(rootContract))
      .functionCall('create_account', {
        new_account_id: accountId,
        new_public_key: PublicKey.from(publicKey).toString(),
      }, options?.gas, options?.deposit === undefined ? ACCOUNT_CREATION_DEPOSIT : options?.deposit)
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  async createFullAccessKey(publicKey: PublicKey | string): Promise<FinalExecutionOutcome> {
    const transaction = (await this.initTransaction(this.signingAccountId))
      .addFullAccessKey(PublicKey.from(publicKey))
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  async createFunctionCallAccessKey(publicKey: PublicKey | string, contractId: string, methodNames?: string[], allowance?: bigint): Promise<FinalExecutionOutcome> {
    const transaction = (await this.initTransaction(this.signingAccountId))
      .addFunctionCallAccessKey(PublicKey.from(publicKey), contractId, methodNames || [], allowance)
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  async deleteAccessKey(publicKey: PublicKey | string): Promise<FinalExecutionOutcome> {
    const transaction = (await this.initTransaction(this.signingAccountId))
      .deleteKey(PublicKey.from(publicKey))
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  async initTransaction(receiver: string) {
    const publicKey = await this.getSigningPublicKey();
    const { nonce } = await this.viewer.accessKey(this.signingAccountId, publicKey);
    const { header } = await this.getBlock();

    return new TransactionComposer({
      header,
      nonce: BigInt(nonce) + BigInt(1),
      publicKey,
      receiver,
      sender: this.signingAccountId,
    });
  }

  async sendNear(receiver: string, amount: bigint) {
    const transaction = (await this.initTransaction(receiver))
      .transfer(amount)
      .toTransaction();

    const { signedTx } = await this.signTransaction(transaction);
    return this.sendTransaction(signedTx);
  }

  sign(message: Uint8Array) {
    return this.signMessage(message);
  }

  async signDelegateAction(delegateAction: DelegateAction) {
    const message = encodeDelegateAction(delegateAction);
    const signature = await this.signMessage(message);

    const signedDelegateAction = new SignedDelegate({
      delegateAction,
      signature: new Signature({
        keyType: delegateAction.publicKey.keyType,
        data: signature,
      }),
    });

    return {
      hash: new Uint8Array(sha256(message)),
      signedDelegateAction,
    };
  }

  async signTransaction(transaction: Transaction) {
    const encodedTx = transaction.encode();
    const { signature } = await this.signMessage(encodedTx);
    const signedTx = new SignedTransaction({
      transaction,
      signature: new TxSignature({
        keyType: transaction.publicKey.keyType,
        data: signature,
      }),
    });

    return {
      hash: new Uint8Array(sha256(encodedTx)),
      signedTx,
    };
  }

  async sendTransaction(signedTx: SignedTransaction) {
    const outcome = await this.rpcProvider.sendTransaction(signedTx);
    const status = outcome.status as FinalExecutionStatus;
    if (status?.Failure) {
      // @ts-expect-error FIXME untyped property copied into ServerError instance as part of parseResultError()
      const { kind } = parseResultError(outcome).kind;
      console.error(kind);
    }

    return outcome;
  }

  get viewer() {
    if (!this.rpcProvider) {
      throw new Error('RpcProviderNotDefined');
    }

    return new Viewer(this.rpcProvider);
  }

  view<T extends QueryResponseKind>(contractId: string, method: string, args: object = {}, options?: ViewOptions) {
    return this.viewer.callFunction<T>(contractId, method, args, options);
  }

  async getBalance(accountId: string) {
    return parseBalance(
      await this.viewer.accountState(accountId),
      await this.getProtocolConfig(),
    );
  }

  async getBlock(block?: BlockReference) {
    return this.rpcProvider.block(block || { finality: 'final' });
  }

  getProtocolConfig(block?: BlockReference) {
    return this.rpcProvider.experimental_protocolConfig(block || { finality: 'optimistic' });
  }

  withMainnetRpc(url = MAINNET_RPC_URL) {
    this.network = 'mainnet';
    return this.withRpcProvider(url);
  }

  withRpcProvider(url: string) {
    this.rpcProvider = new JsonRpcProvider({ url });
    return this;
  }

  withSigningAccount(accountId: string) {
    this.signingAccountId = accountId;
    return this;
  }

  withTestnetRpc(url = TESTNET_RPC_URL) {
    this.network = 'testnet';
    return this.withRpcProvider(url);
  }

  withUnencryptedFilesystemKeystore(credentialsPath?: string) {
    const keystore = new UnencryptedFileSystemKeyStore(credentialsPath || path.join(os.homedir(), DEFAULT_FILESYSTEM_KEYSTORE_PATH));
    const signer = new InMemorySigner(keystore);
    this.signMessage = (message: Uint8Array) => signer.signMessage(message, this.signingAccountId, this.network);
    this.getSigningPublicKey = () => signer.getPublicKey(this.signingAccountId, this.network);
    return this;
  }
}
