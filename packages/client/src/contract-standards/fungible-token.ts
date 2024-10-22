/**
 * Interface for Fungible Token contracts covering the following standards:
 * - Fungible Token Standard: https://github.com/near/NEPs/blob/master/neps/nep-0141.md
 * - Fungible Token Metadata: https://github.com/near/NEPs/blob/master/neps/nep-0148.md
 * 
 * See contract-standards/fungible-token.ts in @near-js/cookbook for example usage
 */
import { functionCall } from "../transactions/actions";
import type {
  FungibleTokenMetadata,
  FungibleTokenMetadataProvider,
  FungibleTokenCore,
} from "near-contract-standards/lib";
import type { FunctionCallParams, ViewParams } from "../interfaces";
import type { FinalExecutionOutcome } from "@near-js/types";
import { view } from "../view";

type FungibleTokenParams<T extends keyof (FungibleTokenCore)> = Omit<
  FunctionCallParams,
  "method" | "args"
> & {
  args: Parameters<(FungibleTokenCore)[T]>[0];
};

type FungibleTokenViewParams<T extends keyof (FungibleTokenCore & FungibleTokenMetadataProvider)> = Omit<
  ViewParams,
  "method" | "args"
> & {
  args: Parameters<(FungibleTokenCore & FungibleTokenMetadataProvider)[T]>[0];
};

type FungibleTokenReturn<T extends keyof (FungibleTokenCore)> = {
  outcome: FinalExecutionOutcome;
  result: ReturnType<(FungibleTokenCore)[T]>;
};

type FungibleTokenViewReturn<T extends keyof (FungibleTokenCore & FungibleTokenMetadataProvider)> =
  ReturnType<(FungibleTokenCore & FungibleTokenMetadataProvider)[T]>;

export async function ftTransfer(
  params: FungibleTokenParams<"ft_transfer">
): Promise<FungibleTokenReturn<"ft_transfer">> {
  // bigints go over the wire as strings
  const {args, ...otherParams} = params;
  const convertedArgs = {
    ...args,
    amount: args.amount ? args.amount.toString() : undefined,
  };
  const { outcome } = await functionCall({
    args: convertedArgs,
    ...otherParams,
    method: "ft_transfer",
    deposit: 1n,
  });

  return {
    outcome,
    result: undefined,
  };
}

/**
 * TODO This function is untested
 */
export async function ftTransferCall(
  params: FungibleTokenParams<"ft_transfer_call">
): Promise<FungibleTokenReturn<"ft_transfer_call">> {
  // bigints go over the wire as strings
  const {args, ...otherParams} = params;
  const convertedArgs = {
    ...args,
    amount: args.amount ? args.amount.toString() : undefined,
  };
  const { outcome, result } = await functionCall({
    args: convertedArgs,
    ...otherParams,
    method: "ft_transfer_call",
    deposit: 1n,
  });

  return {
    outcome,
    // result: result as string,
    result: BigInt(result as string),
  };
}

export async function ftTotalSupply(
  params: FungibleTokenViewParams<"ft_total_supply">
): Promise<FungibleTokenViewReturn<"ft_total_supply">> {
  const result = await view({
    ...params,
    method: "ft_total_supply",
  });

  return BigInt(result as string);
}

export async function ftBalanceOf(
  params: FungibleTokenViewParams<"ft_balance_of">
): Promise<FungibleTokenViewReturn<"ft_balance_of">> {
  const result = await view({
    ...params,
    method: "ft_balance_of",
  });

  return BigInt(result as string);
}

/**
 * Fungible Token Metadata is techically a separate NEP standard, but it's
 * included here for convenience
 * NEP: https://github.com/near/NEPs/blob/master/neps/nep-0148.md
 */
export async function ftMetadata(
  params: FungibleTokenViewParams<"ft_metadata">
): Promise<FungibleTokenViewReturn<"ft_metadata">> {
  const result = await view({
    ...params,
    method: "ft_metadata",
  });

  return result as FungibleTokenMetadata;
}