import { Action } from "../transaction";
/**
 * @hidden
 * Check if given access key allows the function call or method attempted in transaction
 * @param accessKey Array of {access_key: AccessKey, public_key: PublicKey} items
 * @param receiverId The NEAR account attempting to have access
 * @param actions The action(s) needed to be checked for access
 */
export declare function accessKeyMatchesTransaction(accountId: string, accessKey: any, receiverId: string, actions: Action[]): Promise<boolean>;
