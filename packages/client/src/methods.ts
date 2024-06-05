import { ClientParams, NearClient } from './composer';

export const getBalance = (accountId: string, clientOptions?: ClientParams) => new NearClient(clientOptions).getBalance(accountId);
export const getContractCode = (accountId: string, clientOptions?: ClientParams) => new NearClient(clientOptions).viewer.contractCode(accountId);
