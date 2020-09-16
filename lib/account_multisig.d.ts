import { Account } from './account';
import { Contract } from './contract';
import { Connection } from './connection';
import { Action } from './transaction';
import { FinalExecutionOutcome } from './providers';
export declare class AccountMultisig extends Account {
    contract: MultisigContract;
    constructor(connection: Connection, accountId: string);
    protected signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
}
export declare class MultisigContract extends Contract {
    get_request_nonce(): any;
    list_request_ids(): any;
}
