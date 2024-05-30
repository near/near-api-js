import { PublicKey } from '@near-js/crypto';
import type { Provider } from '@near-js/providers';
import type {
  AccessKeyList,
  AccessKeyViewRaw,
  AccountView,
  QueryResponseKind,
  ViewStateResult,
} from '@near-js/types';

import { ViewOptions } from './types';

export class Viewer {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }
  
  get defaultOptions(): ViewOptions {
    return {
      block: { finality: 'optimistic' },
    };
  }

  accessKey(accountId: string, publicKey: PublicKey, options?: ViewOptions) {
    return this.provider.query<AccessKeyViewRaw>({
      request_type: 'view_access_key',
      account_id: accountId,
      public_key: publicKey.toString(),
      ...(options?.block || this.defaultOptions.block),
    });
  }

  accessKeys(accountId: string, options?: ViewOptions) {
    return this.provider.query<AccessKeyList>({
      request_type: 'view_access_key_list',
      account_id: accountId,
      ...(options?.block || this.defaultOptions.block),
    });
  }

  accountState(accountId: string, options?: ViewOptions) {
    return this.provider.query<AccountView>({
      request_type: 'view_account',
      account_id: accountId,
      ...(options?.block || this.defaultOptions.block),
    });
  }

  callFunction<T extends QueryResponseKind>(contractId: string, method: string, args: Buffer | object, options?: ViewOptions) {
    const argsBytes = Buffer.isBuffer(args) ? args : Buffer.from(JSON.stringify(args));
    return this.provider.query<T>({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: argsBytes.toString('base64'),
      ...(options?.block || this.defaultOptions.block),
    });
  }

  contractCode(contractId: string, options?: ViewOptions) {
    return this.provider.query<ViewStateResult>({
      request_type: 'view_code',
      account_id: contractId,
      ...(options?.block || this.defaultOptions.block),
    });
  }

  contractState(contractId: string, prefix: string | Uint8Array, options?: ViewOptions) {
    return this.provider.query<ViewStateResult>({
      request_type: 'view_state',
      account_id: contractId,
      prefix_base64: Buffer.from(prefix).toString('base64'),
      ...(options?.block || this.defaultOptions.block),
    });
  }
}
