import { FinalExecutionOutcome } from '../providers';
import { parseRpcError } from './rpc_errors';

const SUPPRESS_LOGGING = !!process.env.NEAR_NO_LOGS;

export function printLogsAndFailures({
    contractId,
    outcome,
    suppressLogging = SUPPRESS_LOGGING,
}: { contractId: string, outcome: FinalExecutionOutcome, suppressLogging?: boolean }) {
    if (suppressLogging) {
        return;
    }

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
        console.log(`Receipt${result.receiptIds.length > 1 ? 's' : ''}: ${result.receiptIds.join(', ')}`);
        printLogs({
            contractId,
            logs: result.logs,
            prefix: '\t',
        });

        if (result.failure) {
            console.warn(`\tFailure [${contractId}]: ${result.failure}`);
        }
    }
}

export function printLogs({
    contractId,
    logs,
    prefix = '',
    suppressLogging = SUPPRESS_LOGGING,
}: { contractId: string, logs: string[], prefix?: string, suppressLogging?: boolean }) {
    if (suppressLogging) {
        return;
    }

    for (const log of logs) {
        console.log(`${prefix}Log [${contractId}]: ${log}`);
    }
}
