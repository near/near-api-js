import { functionCall } from "../transactions/actions";
import type {
  NonFungibleTokenCore,
  NonFungibleTokenEnumeration,
  NonFungibleTokenMetadataProvider,
  NFTContractMetadata,
  // TokenMetadata,
  Token
} from "near-contract-standards/lib";
import type {
  FunctionCallParams,
  ViewParams
} from "../interfaces";
import type { FinalExecutionOutcome } from "@near-js/types";
import { view } from "../view";

type NFTParams<T extends keyof (NonFungibleTokenCore)> = Omit<
  FunctionCallParams,
  "method" | "args"
> & {
  args: Parameters<(NonFungibleTokenCore)[T]>[0];
};

type NFTViewParams<T extends keyof (NonFungibleTokenCore & NonFungibleTokenEnumeration & NonFungibleTokenMetadataProvider)> = Omit<
  ViewParams,
  "method" | "args"
> & {
  args: Parameters<(NonFungibleTokenCore & NonFungibleTokenEnumeration & NonFungibleTokenMetadataProvider)[T]>[0];
};

type NFTReturn<T extends keyof (NonFungibleTokenCore)> = {
  outcome: FinalExecutionOutcome;
  result: ReturnType<(NonFungibleTokenCore)[T]>;
};

type NFTViewReturn<T extends keyof (NonFungibleTokenCore & NonFungibleTokenEnumeration & NonFungibleTokenMetadataProvider)> =
  ReturnType<(NonFungibleTokenCore & NonFungibleTokenEnumeration & NonFungibleTokenMetadataProvider)[T]>;

export async function nftTransfer(
  params: NFTParams<"nft_transfer">
): Promise<NFTReturn<"nft_transfer">> {
  const { outcome } = await functionCall({
    ...params,
    method: "nft_transfer",
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
export async function nftTransferCall(
  params: NFTParams<"nft_transfer_call">
): Promise<NFTReturn<"nft_transfer_call">> {
  const { outcome, result } = await functionCall({
    ...params,
    method: "nft_transfer_call",
    deposit: 1n,
  });

  return {
    outcome,
    result: result as string,
  };
}

export async function nftToken(
  params: NFTViewParams<"nft_token">
): Promise<NFTViewReturn<"nft_token">> {
  const result = await view({
    ...params,
    method: "nft_token",
  });

  return result as Token;
}

// ! NOTE: according to the NEP, this function should return a string but
// ! the contract standards lib incorrectly implements it as a number, therefore
// ! we break from usage of the lib and implement our own return type. We expect
// ! a string then cast to bigint for convenience
export async function nftTotalSupply(
  params: NFTViewParams<"nft_total_supply">
): Promise<bigint> {
  const result = await view({
    ...params,
    method: "nft_total_supply",
  });

  if (typeof result === "string" || typeof result === "number") {
    // technically we shouldn't allow number, but we will allow it in case
    // the contract is built against the incorrect near-sdk-js spec
    try {
      const bi = BigInt(result);
      return bi;
    } catch (e) {
      throw new Error("nft_total_supply result could not be converted to bigint");
    }
  }
  throw new Error("nft_total_supply did not return a string or number");
}

// ! NOTE: according to the NEP, this function should return a string but
// ! the contract standards lib incorrectly implements it as a number, therefore
// ! we break from usage of the lib and implement our own return type. We expect
// ! a string then cast to bigint for convenience
export async function nftSupplyForOwner(
  params: NFTViewParams<"nft_supply_for_owner">
): Promise<bigint> {
  const result = await view({
    ...params,
    method: "nft_supply_for_owner",
  });

  if (typeof result === "string" || typeof result === "number") {
    // technically we shouldn't allow number, but we will allow it in case
    // the contract is built against the incorrect near-sdk-js spec
    try {
      const bi = BigInt(result);
      return bi;
    } catch (e) {
      throw new Error("nft_supply_for_owner result could not be converted to bigint");
    }
  }
  throw new Error("nft_supply_for_owner did not return a string or number");
}

// ! Convert `from_index` to bigint | null to match the NEP
type NFTTokensParams = Omit<NFTViewParams<"nft_tokens">, "args"> & {
  args: Omit<NFTViewParams<"nft_tokens">["args"], "from_index"> & {
    from_index: bigint | null;
  };
};
export async function nftTokens(
  params: NFTTokensParams
): Promise<NFTViewReturn<"nft_tokens">> {
  // bigints go over the wire as strings
  const {args, ...otherParams} = params;
  const convertedArgs = {
    ...args,
    from_index: args.from_index ? args.from_index.toString() : null,
  };
  const result = await view({
    args: convertedArgs,
    ...otherParams,
    method: "nft_tokens",
  });

  return result as Token[];
}

// ! Convert `from_index` to bigint | null to match the NEP
type NFTTokensForOwnerParams = Omit<NFTViewParams<"nft_tokens_for_owner">, "args"> & {
  args: Omit<NFTViewParams<"nft_tokens_for_owner">["args"], "from_index"> & {
    from_index: bigint | null;
  };
};

export async function nftTokensForOwner(
  params: NFTTokensForOwnerParams
): Promise<NFTViewReturn<"nft_tokens_for_owner">> {
  // bigints go over the wire as strings
  const {args, ...otherParams} = params;
  const convertedArgs = {
    ...args,
    from_index: args.from_index ? args.from_index.toString() : null,
  };
  const result = await view({
    args: convertedArgs,
    ...otherParams,
    method: "nft_tokens_for_owner",
  });

  return result as Token[];
}

export async function nftMetadata(
  params: NFTViewParams<"nft_metadata">
): Promise<NFTViewReturn<"nft_metadata">> {
  const result = await view({
    ...params,
    method: "nft_metadata",
  });

  return result as NFTContractMetadata;
}