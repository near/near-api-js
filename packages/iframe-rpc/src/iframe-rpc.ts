import EventEmitter from 'events';

import {IFrameRPCError} from './iframe-rpc-error';
import {
    windowReceiver,
    IMessageEvent,
    IMessagePoster,
    IMessageReceiver,
    IRPCMethod,
    IRPCResponse,
    isRPCMessage,
    RPCMessage,
} from './types';

function responseObjToError(obj: { code: number; message: string; }) {
    return new IFrameRPCError(obj.message, obj.code);
}

export interface IRPCOptions {
    target: IMessagePoster;
    requesterId: string;
    origin?: string;
    protocolVersion?: string;
    receiver?: IMessageReceiver;
}

const readyId = -1;

export class IFrameRPC extends EventEmitter {
    public readonly isReady: Promise<void>;
    private calls: {
        [id: number]: (err: null | IFrameRPCError, result: any) => void;
    } = Object.create(null);
    private lastCallId = 0;
    private remoteProtocolVersion: string | undefined;
    private readonly removeMessageListener: () => void;

    constructor(private readonly options: IRPCOptions) {
        super();
        this.removeMessageListener = (options.receiver || windowReceiver).readMessages(this.messageEventListener);

        this.isReady = this.createReadyPromise();
    }

    private createReadyPromise() {
        return new Promise<void>(resolve => {
            const response = {protocolVersion: this.options.protocolVersion || '1.0'};

            this.bindMethodHandler('ready', () => {
                resolve();
                return response;
            });

            this.callMethod<void>('ready', response)
                .then(resolve)
                .catch(resolve);
        });
    }

    static getReadyInstance(options: IRPCOptions): Promise<IFrameRPC> {
        const rpc = new IFrameRPC(options);
        return rpc.isReady.then(() => rpc);
    }

    public bindMethodHandler<T>(method: string, handler: (params: T) => Promise<any> | any): this {
        this.on(method, (data: IRPCMethod<T>) => {
            new Promise(resolve => resolve(handler(data.params)))
                .then((result) => ({
                    type: 'response',
                    requesterId: this.options.requesterId,
                    id: data.id,
                    result,
                } as IRPCResponse<any>))
                .catch((err: Error) => ({
                    type: 'response',
                    requesterId: this.options.requesterId,
                    id: data.id,
                    error:
                        err instanceof IFrameRPCError
                            ? err.toResponseError()
                            : {code: 0, message: err.stack || err.message},
                } as IRPCResponse<any>))
                .then(message => {
                    this.emit('sendResponse', message);
                    this.post(message);
                });
        });

        return this;
    }

    public callMethod<T>(method: string, params: object): Promise<T> {
        const id = method === 'ready' ? readyId : this.lastCallId;
        const message: IRPCMethod<any> = {
            type: 'method',
            requesterId: this.options.requesterId,
            id,
            params,
            method,
        };

        this.emit('sendMethod', message);
        this.post(message);

        return new Promise((resolve, reject) => {
            this.calls[id] = (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            };
        });
    }

    public destroy() {
        this.emit('destroy');
        this.removeMessageListener();
    }

    public remoteVersion(): string | undefined {
        return this.remoteProtocolVersion;
    }

    private handleResponse(message: IRPCResponse<any>) {
        const handler = this.calls[message.id];
        if (!handler) {
            return;
        }

        if (message.error) {
            handler(responseObjToError(message.error), null);
        } else {
            handler(null, message.result);
        }

        delete this.calls[message.id];
    }

    private post<T>(message: RPCMessage<T>) {
        this.options.target.postMessage(JSON.stringify(message), this.options.origin || '*');
    }

    static isReadySignal(message: RPCMessage<any>) {
        if (message.type === 'method' && message.method === 'ready') {
            return true;
        }

        return message.type === 'response' && message.id === readyId;
    }

    private messageEventListener = (ev: IMessageEvent) => {
        if (this.options.origin && this.options.origin !== '*' && ev.origin !== this.options.origin) {
            return;
        }

        let message: RPCMessage<any>;
        try {
            message = JSON.parse(ev.data);
        } catch (e) {
            return;
        }

        if (!isRPCMessage(message) || message.requesterId !== this.options.requesterId) {
            return;
        }

        if (IFrameRPC.isReadySignal(message)) {
            const params: { protocolVersion: string } | undefined =
                message.type === 'method' ? message.params : message.result;
            this.remoteProtocolVersion = params?.protocolVersion ?? this.remoteProtocolVersion;

            this.emit('isReady', true);
            return;
        }

        this.emit('dataReceived', message);
        this.handleMessage(message);
    };

    private handleMessage(message: RPCMessage<any>) {
        switch (message.type) {
            case 'method':
                this.emit('methodReceived', message);
                if (this.listeners(message.method).length > 0) {
                    this.emit(message.method, message);
                    return;
                }

                this.post({
                    type: 'response',
                    requesterId: this.options.requesterId,
                    id: message.id,
                    error: {code: 4003, message: `Unknown method name "${message.method}"`},
                    result: null,
                });
                break;
            case 'response':
                this.emit('responseReceived', message);
                this.handleResponse(message);
                break;
            default:
            // Ignore
        }
    }
}