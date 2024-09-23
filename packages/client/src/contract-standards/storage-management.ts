/**
 * Interface for Storage Management contracts covering the following standards:
 * - Storage Management: https://github.com/near/NEPs/blob/master/neps/nep-0145.md
 * 
 * See contract-standards/storage-management.ts in @near-js/cookbook for example usage
 */

import { functionCall } from "../transactions/actions";
import type {
  StorageBalance,
  StorageManagement,
  StorageBalanceBounds,
} from "near-contract-standards/lib";
import type { FunctionCallParams, ViewParams } from "../interfaces";
import type { FinalExecutionOutcome } from "@near-js/types";
import { view } from "../view";

type StorageManagementParams<T extends keyof StorageManagement> = Omit<
  FunctionCallParams,
  "method" | "args"
> & {
  args: Parameters<StorageManagement[T]>[0];
};

type StorageManagementViewParams<T extends keyof StorageManagement> = Omit<
  ViewParams,
  "method" | "args"
> & {
  args: Parameters<StorageManagement[T]>[0];
};

type StorageManagementReturn<T extends keyof StorageManagement> = {
  outcome: FinalExecutionOutcome;
  result: ReturnType<StorageManagement[T]>;
};
type StorageManagementViewReturn<T extends keyof StorageManagement> =
  ReturnType<StorageManagement[T]>;

export async function storageDeposit(
  params: StorageManagementParams<"storage_deposit">
): Promise<StorageManagementReturn<"storage_deposit">> {
  const { outcome, result } = await functionCall({
    ...params,
    method: "storage_deposit",
  });

  // Ensure the result matches the StorageBalance structure
  if (
    typeof result === "object" &&
    typeof result?.["total"] === "string" &&
    typeof result?.["available"] === "string"
  ) {
    const storageBalance = result as StorageBalance;

    // cast string bigints to bigint literals
    Object.assign(storageBalance, {
      total: BigInt(storageBalance.total),
      available: BigInt(storageBalance.available),
    });

    return {
      outcome,
      result: storageBalance,
    };
  }

  throw new Error("Unexpected result format from storage_deposit");
}

export async function storageUnregister(
  params: StorageManagementParams<"storage_unregister">
): Promise<StorageManagementReturn<"storage_unregister">> {
  const { outcome, result } = await functionCall({
    ...params,
    method: "storage_unregister",
  });

  return {
    outcome,
    result: Boolean(result),
  };
}

export async function storageWithdraw(
  params: StorageManagementParams<"storage_withdraw">
): Promise<StorageManagementReturn<"storage_withdraw">> {

  // bigints go over the wire as strings
  const {args, ...otherParams} = params;
  const convertedArgs = {
    ...args,
    amount: args.amount ? args.amount.toString() : undefined,
  };

  const { outcome, result } = await functionCall({
    args: convertedArgs,
    ...otherParams,
    method: "storage_withdraw",
    deposit: 1n,
  });

  console.log("result", result);
  console.log("outcome", outcome);
  if (
    typeof result === "object" &&
    typeof result?.["total"] === "string" &&
    typeof result?.["available"] === "string"
  ) {
    const storageBalance = result as StorageBalance;

    // cast string bigints to bigint literals
    Object.assign(storageBalance, {
      total: BigInt(storageBalance.total),
      available: BigInt(storageBalance.available),
    });

    return {
      outcome,
      result: storageBalance,
    };
  } else {
    throw new Error("Unexpected result format from storage_withdraw");
  }
}

export async function storageBalanceBounds(
  params: StorageManagementViewParams<"storage_balance_bounds">
): Promise<StorageManagementViewReturn<"storage_balance_bounds">> {
  const result = await view({
    ...params,
    method: "storage_balance_bounds",
  });

  if (
    typeof result === "object" &&
    typeof result?.["min"] === "string" &&
    typeof result?.["max"] === "string"
  ) {
    const storageBalanceBounds = result as StorageBalanceBounds;

    // cast string bigints to bigint literals
    Object.assign(storageBalanceBounds, {
      min: BigInt(storageBalanceBounds.min),
      max: BigInt(storageBalanceBounds.max),
    });

    return storageBalanceBounds;
  } else {
    throw new Error("Unexpected result format from storage_balance_bounds");
  }
}

export async function storageBalanceOf(
  params: StorageManagementViewParams<"storage_balance_of">
): Promise<StorageManagementViewReturn<"storage_balance_of">> {
  const result = await view({
    ...params,
    method: "storage_balance_of",
  });

  if (
    typeof result === "object" &&
    typeof result?.["total"] === "string" &&
    typeof result?.["available"] === "string"
  ) {
    const storageBalance = result as StorageBalance;

    // cast string bigints to bigint literals
    Object.assign(storageBalance, {
      total: BigInt(storageBalance.total),
      available: BigInt(storageBalance.available),
    });

    return storageBalance;
  } else if (result === null) {
    return null;
  } else {
    throw new Error("Unexpected result format from storage_balance_of");
  }
}
