/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ContractState extends Array<{
    key: Uint8Array;
    value: Uint8Array;
}> { }