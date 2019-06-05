export declare type ConnectionInfo = {
    url: string;
    user?: string;
    password?: string;
    allowInsecure?: boolean;
    timeout?: number;
    headers?: {
        [key: string]: string | number;
    };
};
export declare function fetchJson(connection: string | ConnectionInfo, json?: string): Promise<any>;
