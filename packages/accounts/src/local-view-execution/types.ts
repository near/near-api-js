export interface ContractState
    extends Array<{
        key: Buffer;
        value: Buffer;
    }> {}
