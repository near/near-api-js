/**
 * Tailored functionCall invocations for StorageManagement contract standard
 */

import { functionCall } from '../transactions/actions';
import type { StorageBalance, StorageManagement } from 'near-contract-standards/lib';
import type { FunctionCallParams, /*ViewParams */ } from '../interfaces';
import type { FinalExecutionOutcome } from '@near-js/types';
// import { view } from '../view';

// import type { StorageManagement, StorageBalance, StorageBalanceBounds } from 'near-contract-standards/lib/storage_management';
// import { AccountId } from 'near-sdk-js';
// import { Option } from 'near-contract-standards/lib/non_fungible_token/utils';

type StorageManagementParams<T extends keyof StorageManagement> = Omit<FunctionCallParams, 'method' | 'args'> & {
  args: Parameters<StorageManagement[T]>[0]
};

// type StorageManagementViewParams<T extends keyof StorageManagement> = Omit<ViewParams, 'method' | 'args'> & {
//   args: Parameters<StorageManagement[T]>[0]
// };

type StorageManagementReturn<T extends keyof StorageManagement> = {
  outcome: FinalExecutionOutcome;
  result: ReturnType<StorageManagement[T]>;
};

export async function storageDeposit(
  params: StorageManagementParams<'storage_deposit'>
): Promise<StorageManagementReturn<'storage_deposit'>> {
  const {outcome,result} = await functionCall({
    ...params,
    method: 'storage_deposit'
  });


  // Ensure the result matches the StorageBalance structure
  if (typeof result === 'object' && typeof result?.['total'] === 'string' && typeof result?.['available'] === 'string') {
    const storageBalance = result as StorageBalance;

    // cast string bigints to bigint literals
    Object.assign(storageBalance, {
      total: BigInt(storageBalance.total),
      available: BigInt(storageBalance.available)
    });

    return {
      outcome,
      result: storageBalance
    }
  }
  
  throw new Error('Unexpected result format from storage_deposit');
}

// export async function storageWithdraw(
//   params: StorageManagementParams<'storage_withdraw'>
// ): Promise<StorageManagementReturn<'storage_withdraw'>> {
//   return functionCall({
//     ...params,
//     method: 'storage_withdraw'
//   });
// }

export async function storageUnregister(
  params: StorageManagementParams<'storage_unregister'>
): Promise<StorageManagementReturn<'storage_unregister'>> {
  const {outcome,result} = await functionCall({
    ...params,
    method: 'storage_unregister'
  });

  console.log(result);
  console.log('type', typeof result);
  return {
    outcome,
    result: Boolean(result)
  }
}

// export async function storageBalanceBounds(
//   params: StorageManagementViewParams<'storage_balance_bounds'>
// ): Promise<StorageManagementReturn<'storage_balance_bounds'>> {
//   return view({
//     ...params,
//     method: 'storage_balance_bounds',
//   });
// }

// export async function storageBalanceOf(
//   params: StorageManagementViewParams<'storage_balance_of'>
// ): Promise<StorageManagementReturn<'storage_balance_of'>> {
//   return view({
//     ...params,
//     method: 'storage_balance_of'
//   });
// }