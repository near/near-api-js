import { BlockReference } from "@near-js/types";
import type { Connection } from "./connection";

export interface IntoConnection {
    getConnection(): Connection;
}

/**
 * @deprecated Will be removed in the next major release
 * 
 * Options used to initiate a function call (especially a change function call)
 * @see {@link Account#viewFunction | viewFunction} to initiate a view function call
 */
export interface FunctionCallOptions {
    /** The NEAR account id where the contract is deployed */
    contractId: string;
    /** The name of the method to invoke */
    methodName: string;
    /**
     * named arguments to pass the method `{ messageText: 'my message' }`
     */
    args?: object;
    /** max amount of gas that method call can use */
    gas?: bigint;
    /** amount of NEAR (in yoctoNEAR) to send together with the call */
    attachedDeposit?: bigint;
    /**
     * Convert input arguments into bytes array.
     */
    stringify?: (input: any) => Buffer;
}

/** @deprecated Will be removed in the next major release */
export interface ChangeFunctionCallOptions extends FunctionCallOptions {
    /**
     * Metadata to send the NEAR Wallet if using it to sign transactions.
     * @see RequestSignTransactionsOptions
    */
    walletMeta?: string;
    /**
     * Callback url to send the NEAR Wallet if using it to sign transactions.
     * @see RequestSignTransactionsOptions
    */
    walletCallbackUrl?: string;
}

/** @deprecated Will be removed in the next major release */
export interface ViewFunctionCallOptions extends FunctionCallOptions {
    parse?: (response: Uint8Array) => any;
    blockQuery?: BlockReference;
}