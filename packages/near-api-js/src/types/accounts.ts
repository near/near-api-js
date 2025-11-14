// TODO: Move Account and Provider to types
interface ProviderLike {
    callFunction: (contractId, methodName, args, blockQuery?) => Promise<any>;
}

export interface AccountLike {
    accountId: string;
    provider: ProviderLike;
    getState(): Promise<any>;
    signAndSendTransaction({
        receiverId, actions
    }): Promise<any>;
    callFunction({
        contractId, methodName, args, gas, deposit
    }): Promise<any>;
}