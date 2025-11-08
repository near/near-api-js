import { FinalExecutionOutcome } from '@near-js/types';

import { parseRpcError } from './errors/index.js';
import { Logger } from './logger/index.js';

/**
 * @deprecated Will be removed in the next major release
 * 
 * Parse and print details from a query execution response
 * @param params
 * @param params.contractId ID of the account/contract which made the query
 * @param params.outcome the query execution response
 */
export function printTxOutcomeLogsAndFailures({
    contractId,
    outcome,
}: { contractId: string, outcome: FinalExecutionOutcome }) {
    const flatLogs = [outcome.transaction_outcome, ...outcome.receipts_outcome]
        .reduce((acc, it) => {
            const isFailure = typeof it.outcome.status === 'object' && typeof it.outcome.status.Failure === 'object';
            if (it.outcome.logs.length || isFailure) {
                return acc.concat({
                    receiptIds: it.outcome.receipt_ids,
                    logs: it.outcome.logs,
                    failure: typeof it.outcome.status === 'object' && it.outcome.status.Failure !== undefined
                        ? parseRpcError(it.outcome.status.Failure)
                        : null
                });
            } else {
                return acc;
            }
        }, []);

    for (const result of flatLogs) {
        Logger.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
        printTxOutcomeLogs({
            contractId,
            logs: result.logs,
            prefix: '\t',
        });

        if (result.failure) {
            Logger.warn(`\tFailure [${contractId}]: ${result.failure}`);
        }
    }
}

/**
 * @deprecated Will be removed in the next major release
 * 
 * Format and print log output from a query execution response
 * @param params
 * @param params.contractId ID of the account/contract which made the query
 * @param params.logs log output from a query execution response
 * @param params.prefix string to append to the beginning of each log
 */
export function printTxOutcomeLogs({
    contractId,
    logs,
    prefix = '',
}: { contractId: string, logs: string[], prefix?: string }) {
    for (const log of logs) {
        Logger.log(`${prefix}Log [${contractId}]: ${log}`);
    }
}
