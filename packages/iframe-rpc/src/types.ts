export type RPCMessage<T> = IRPCMethod<T> | IRPCResponse<T>;

export interface IRPCMethod<T> {
    type: 'method';
    requesterId: string;
    id: number;
    method: string;
    params: T;
}

export interface IRPCResponse<T> {
    type: 'response';
    requesterId: string;
    id: number;
    result: T;
    error?: {
        code: number;
        message: string;
    };
}

export function isRPCMessage(data: any): data is RPCMessage<any> {
    return (
        (data.type === 'method' || data.type === 'response') &&
        typeof data.id === 'number' &&
        typeof data.requesterId === 'string'
    );
}

export interface IMessageEvent {
    data: any;
    origin: string;
}

export interface IMessagePoster {
    postMessage(data: any, targetOrigin: string): void;
}

export interface IMessageReceiver {
    readMessages(callback: (ev: IMessageEvent) => void): () => void;
}

export const windowReceiver: IMessageReceiver = {
    readMessages(callback) {
        window.addEventListener('message', callback);

        // Unsubscribe handler for consumers to call to stop listening
        return () => window.removeEventListener('message', callback);
    },
};
