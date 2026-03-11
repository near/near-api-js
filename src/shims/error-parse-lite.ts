// Lightweight error parser for the IIFE browser bundle.
// The full parse.ts pulls in 100+ error classes (~100KB). This shim provides
// the same API but returns generic RpcError instances with descriptive messages
// extracted from the raw RPC error JSON. The full error hierarchy is available
// via ESM/CJS imports or the `near-api-js/rpc-errors` subpath.
//
// InvalidNonceError is preserved because account.ts uses instanceof to trigger
// nonce retry logic.

import { InternalRpcError, RpcError } from '../providers/errors/rpc.js';
import { InvalidNonceError } from '../providers/errors/transaction_execution.js';

function extractMessage(error: unknown): string {
    if (error === null || error === undefined) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (typeof error !== 'object') return String(error);

    const e = error as Record<string, unknown>;

    // Try common RPC error shapes
    if ('error_message' in e && typeof e.error_message === 'string') return e.error_message;
    if ('message' in e && typeof e.message === 'string') return e.message;
    if ('name' in e && typeof e.name === 'string') {
        const info = 'info' in e && typeof e.info === 'object' && e.info !== null ? e.info : {};
        return `${e.name}: ${JSON.stringify(info)}`;
    }

    // Nested cause
    if ('cause' in e && e.cause) return extractMessage(e.cause);

    // Fallback
    return JSON.stringify(error);
}

function extractTxErrorMessage(error: unknown): string {
    if (error === null || error === undefined) return 'Unknown transaction error';
    if (typeof error !== 'object') return String(error);

    const e = error as Record<string, unknown>;

    // TxExecutionError shape: { ActionError: {...} } or { InvalidTxError: {...} }
    if ('ActionError' in e) {
        const ae = e.ActionError as Record<string, unknown>;
        const kind = ae?.kind;
        if (typeof kind === 'string') return `ActionError: ${kind}`;
        if (kind && typeof kind === 'object') {
            const key = Object.keys(kind)[0];
            return `ActionError: ${key}: ${JSON.stringify((kind as Record<string, unknown>)[key])}`;
        }
        return `ActionError: ${JSON.stringify(ae)}`;
    }

    if ('InvalidTxError' in e) {
        const ite = e.InvalidTxError;
        if (typeof ite === 'string') return `InvalidTxError: ${ite}`;
        if (ite && typeof ite === 'object') {
            const key = Object.keys(ite as object)[0];
            return `InvalidTxError: ${key}: ${JSON.stringify((ite as Record<string, unknown>)[key])}`;
        }
        return `InvalidTxError: ${JSON.stringify(ite)}`;
    }

    return JSON.stringify(error);
}

type RawRpcError = { name: string; cause?: unknown; data?: unknown };

export function parseRpcError(error: RawRpcError): RpcError {
    switch (error.name) {
        case 'INTERNAL_ERROR': {
            const cause = error.cause as Record<string, { error_message: string }> | undefined;
            return new InternalRpcError(cause?.info?.error_message ?? 'Internal error');
        }
        default:
            return new RpcError(extractMessage(error));
    }
}

export function parseTransactionExecutionError(error: unknown, txHash: string, _blockHash: string): RpcError {
    // Preserve InvalidNonceError for nonce retry logic in account.ts
    if (error && typeof error === 'object' && 'InvalidTxError' in error) {
        const ite = (error as Record<string, unknown>).InvalidTxError;
        if (ite && typeof ite === 'object' && 'InvalidNonce' in ite) {
            const nonce = (ite as Record<string, { ak_nonce: number; tx_nonce: number }>).InvalidNonce;
            return new InvalidNonceError(nonce.ak_nonce, nonce.tx_nonce, txHash, _blockHash);
        }
    }

    return new RpcError(`Transaction ${txHash} failed: ${extractTxErrorMessage(error)}`);
}

export function parseRpcErrorMessage(errorMessage: string, _blockHash: string, _blockHeight: number): RpcError {
    return new RpcError(errorMessage);
}
