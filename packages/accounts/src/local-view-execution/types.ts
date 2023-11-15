/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ContractState extends Array<{
    key: Buffer;
    value: Buffer;
}> { }