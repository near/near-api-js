import type {
  AccessKeyList,
  AccessKeyView,
  AccountView,
  CodeResult,
  ContractCodeViewRaw,
  QueryResponseKind,
  SerializedReturnValue,
  StakedAccount,
  ViewStateResult,
} from '@near-js/types';

import type {
  AccountState,
  FunctionCallAccessKey,
  FullAccessKey,
  RpcProviderDependency,
  RpcProviderQueryParams,
  ViewAccessKeyParams,
  ViewAccountParams,
  ViewContractStateParams,
  ViewParams,
  ViewValidatorStakeParams,
} from './interfaces';

const DEFAULT_VIEW_BLOCK_REFERENCE = { finality: 'optimistic' };

enum RequestType {
  CallFunction = 'call_function',
  ViewAccessKey = 'view_access_key',
  ViewAccessKeyList = 'view_access_key_list',
  ViewAccount = 'view_account',
  ViewCode = 'view_code',
  ViewState = 'view_state',
}

interface QueryParams extends RpcProviderDependency, RpcProviderQueryParams {
  account: string;
  request: string;
  args?: object;
}

/**
 * Make a readonly request to an RPC endpoint targeting a specific account/contract
 * @param account target account/contract being queried
 * @param request type of request (e.g. `call_function`)
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param rpcProvider RPC provider instance
 */
export function query<T extends QueryResponseKind>({
  account,
  request,
  args = {},
  blockReference,
  deps: { rpcProvider },
}: QueryParams): Promise<T> {
  return rpcProvider.query<T>({
    // @ts-expect-error request_type isn't just a string, but a set of methods
    request_type: request,
    account_id: account,
    ...(blockReference ? blockReference : DEFAULT_VIEW_BLOCK_REFERENCE),
    ...args,
  });
}

/**
 * Call a view method on an account/contract, returning the raw response
 * @param account target account/contract being queried
 * @param method name of the method being invoked
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export function callViewMethod({ account, method, args = {}, blockReference, deps }: ViewParams) {
  return query<CodeResult>({
    request: RequestType.CallFunction,
    account,
    args: {
      args_base64: Buffer.isBuffer(args) ? args : Buffer.from(JSON.stringify(args)).toString('base64'),
      method_name: method,
    },
    blockReference,
    deps,
  });
}

/**
 * Call a view method on an account/contract, parsing the returned data
 * NB if the data returned is a byte array, this method will convert it
 *  to string - use `await (viewRaw(...)).result` to get the buffer
 * @param account target account/contract being queried
 * @param method name of the method being invoked
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function view<T extends SerializedReturnValue>({ account, method, args = {}, blockReference, deps }: ViewParams): Promise<T> {
  const { result } = await callViewMethod({ account, method, args, blockReference, deps });
  const stringResult = Buffer.from(result).toString();
  try {
    return JSON.parse(stringResult);
  } catch {
    const numeric = +stringResult;
    if (isNaN(numeric)) {
      return stringResult as T;
    }

    return (Number.isSafeInteger(numeric) ? numeric : BigInt(numeric)) as T;
  }
}

/**
 * Get metadata for the specified access key
 * @param account target account/contract being queried
 * @param publicKey public key string to be queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getAccessKey({ account, publicKey, blockReference, deps }: ViewAccessKeyParams) {
  const { nonce, permission } = await query<AccessKeyView>({
    request: RequestType.ViewAccessKey,
    account,
    args: {
      public_key: publicKey,
    },
    blockReference,
    deps,
  });

  if (permission === 'FullAccess') {
    return {
      nonce: BigInt(nonce),
      publicKey,
    } as FullAccessKey;
  }
  const { FunctionCall: { allowance, receiver_id, method_names } } = permission;
  return {
    allowance: BigInt(allowance),
    contract: receiver_id,
    methods: method_names,
    nonce: BigInt(nonce),
    publicKey,
  } as FunctionCallAccessKey;
}

/**
 * Get account metadata (e.g. balance, storage)
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getAccountState({ account, blockReference, deps }: ViewAccountParams) {
  const accountState = await query<AccountView>({
    request: RequestType.ViewAccount,
    account,
    blockReference,
    deps,
  });

  return {
    availableBalance: BigInt(accountState.amount),
    codeHash: accountState.code_hash,
    locked: BigInt(accountState.locked),
    storageUsed: BigInt(accountState.storage_usage),
  } as AccountState;
}

/**
 * Get list of access keys for the specified account/contract
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getAccessKeys({ account, blockReference, deps }: ViewAccountParams) {
  const { keys } = await query<AccessKeyList>({
    request: RequestType.ViewAccessKeyList,
    account,
    blockReference,
    deps,
  });

  return keys.reduce((accessKeys, { access_key: { nonce, permission }, public_key: publicKey }) => {
    if (permission === 'FullAccess') {
      accessKeys.fullAccessKeys.push({
        nonce,
        publicKey,
      });
    } else {
      const { FunctionCall: { allowance, receiver_id, method_names } } = permission;
      accessKeys.functionCallAccessKeys.push({
        allowance: BigInt(allowance),
        contract: receiver_id,
        methods: method_names,
        nonce,
        publicKey,
      });
    }

    return accessKeys;
  }, { fullAccessKeys: [] as FullAccessKey[], functionCallAccessKeys: [] as FunctionCallAccessKey[] });
}

/**
 * Get the code for the contract deployed to the target account
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getContractCode({ account, blockReference, deps }: ViewAccountParams) {
  const { code_base64, hash } = await query<ContractCodeViewRaw>({
    request: RequestType.ViewCode,
    account,
    blockReference,
    deps,
  });

  return { code: Buffer.from(code_base64, 'base64').toString(), code_base64, hash };
}

/**
 * Get the state on the contract deployed to the target account in key-value pairs
 * @param account target account/contract being queried
 * @param prefix target prefix filter (empty string/buffer returns all keys)
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 * @returns object key-value pairs
 */
export async function getContractState({ account, prefix, blockReference, deps }: ViewContractStateParams) {
  const { values } = await query<ViewStateResult>({
    request: RequestType.ViewState,
    account,
    args: {
      prefix_base64: Buffer.from(prefix).toString('base64'),
    },
    blockReference,
    deps,
  });

  return values.reduce((state, { key, value }) => ({
    ...state,
    [key]: value,
  }), {});
}

/**
 * Get the nonce for the specified access key
 * @param account target account/contract being queried
 * @param publicKey public key string to be queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getNonce({ account, publicKey, blockReference, deps }: ViewAccessKeyParams) {
  const { nonce } = await getAccessKey({
    account,
    publicKey,
    blockReference,
    deps,
  });

  return BigInt(nonce);
}

/**
 * Get the balance staked with a validator
 * @param account the account staking Near with the validator
 * @param validator contract with which Near is staked
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getStakedBalance({ account, validator, blockReference, deps }: ViewValidatorStakeParams) {
  const staked = await view<StakedAccount>({
    account: validator,
    blockReference,
    method: 'get_account',
    args: { account_id: account },
    deps,
  });

  return {
    canWithdraw: staked.can_withdraw,
    stakedBalance: BigInt(staked.staked_balance),
    unstakedBalance: BigInt(staked.unstaked_balance),
  };
}
