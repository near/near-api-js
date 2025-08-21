import { formatAmount, parseAmount } from './format';
import type { AccountLike } from '@near-js/types';

interface FTMetadata {
    spec?: string;
    name: string;
    decimals: number;
    symbol: string;
    icon?: string;
}

abstract class BaseFT {
    public readonly metadata: FTMetadata;

    constructor(metadata: FTMetadata) {
        this.metadata = metadata;
    }

    /**
     * Converts a decimal number to indivisible units
     * 
     * @param amount The amount in decimal format (e.g. "1.234")
     * @returns The amount in indivisible units (e.g. "1234")
     */
    public toUnits(amount: string | number): bigint {
        const units = parseAmount(amount.toString(), this.metadata.decimals);
        return BigInt(units);
    }

    /**
     * Converts indivisible units to a decimal number (represented as a string)
     * 
     * @param units The amount in indivisible units (e.g. "1234")
     * @param precision (optional) number of digits shown to the right of the decimal point - rounded down
     * @returns The amount as a decimal string (e.g. "1.234")
     */
    public toDecimal(amount: bigint | string | number, precision?: bigint | string | number): string {
        return formatAmount(amount, this.metadata.decimals, precision);
    }

    /**
     * Get the available balance of an account in indivisible units
     * 
     * @param account The account to get the balance of
     * @returns 
     */
    abstract getBalance(account: AccountLike): Promise<bigint>;

    /**
     * Transfer tokens from one account to another
     * 
     * @param param
     * @param param.from The Account that will transfer the tokens
     * @param param.receiverId The AccountID that will receive the tokens
     * @param param.amount The amount of tokens to transfer in the smallest unit
     */
    abstract transfer({ from, receiverId, amount }: { from: AccountLike, receiverId: string, amount: string | number | bigint }): Promise<any>
}

export class NativeToken extends BaseFT {
    constructor(metadata: FTMetadata) {
        super(metadata);
    }

    public async transfer({ from, receiverId, amount }: { from: AccountLike, receiverId: string, amount: string | number | bigint }): Promise<any> {
        return from.signAndSendTransaction({
            receiverId,
            actions: [{ transfer: { deposit: amount.toString() } }],
        });
    }

    public async getBalance(account: AccountLike): Promise<bigint> {
        const { balance: { available } } = await account.getState();
        return available;
    }
}

export class FungibleToken extends BaseFT {
    public readonly accountId: string;

    constructor(accountId: string, metadata: FTMetadata) {
        metadata.spec = metadata.spec || 'ft-1.0.0';
        super(metadata);
        this.accountId = accountId;
    }

    public async transfer({ from, receiverId, amount }: { from: AccountLike, receiverId: string, amount: string | number | bigint }): Promise<any> {
        return from.callFunction({
            contractId: this.accountId,
            methodName: 'ft_transfer',
            args: {
                amount: amount.toString(),
                receiver_id: receiverId,
            },
            gas: '30000000000000',
            deposit: 1,
        });
    }

    public async getBalance(account: AccountLike): Promise<bigint> {
        const balance = await account.provider.callFunction(
            this.accountId,
            'ft_balance_of',
            {
                account_id: account.accountId,
            },
        );
        return BigInt(balance);
    }

    /**
     * Transfer tokens and call a function on the receiver contract,
     * only works if the receiver implements the `ft_on_transfer` method
     * 
     * @param param
     * @param param.from The Account that will transfer the tokens
     * @param param.receiverId The AccountID that will receive the tokens
     * @param param.units The amount of tokens to transfer in the smallest unit
     * @param param.msg The message to send to the `ft_on_transfer` method
     */
    public async transferCall({ from, receiverId, amount, msg }: { from: AccountLike, receiverId: string, amount: bigint, msg: string }): Promise<any> {
        return from.callFunction({
            contractId: this.accountId,
            methodName: 'ft_transfer_call',
            args: {
                receiver_id: receiverId,
                amount: amount.toString(),
                msg,
            },
            gas: '30000000000000',
            deposit: 1,
        });
    }

    /**
     * Register an account to the fungible token contract by paying a storage deposit
     * 
     * @param param
     * @param param.accountIdToRegister The AccountID to register
     * @param param.fundingAccount The Account that will fund the registration
     */
    public async registerAccount({ accountIdToRegister, fundingAccount }: { accountIdToRegister: AccountLike, fundingAccount: AccountLike }): Promise<any> {

        const { result } = await fundingAccount.provider.callFunction(
            this.accountId,
            'storage_balance_bounds',
            {}
        );

        const requiredDeposit = result.min as string;

        return fundingAccount.callFunction({
            contractId: this.accountId,
            methodName: 'storage_deposit',
            args: {
                account_id: accountIdToRegister,
                registration_only: true,
            },
            gas: '30000000000000',
            deposit: requiredDeposit,
        });
    }

    /**
     * Unregister an account from the fungible token contract by paying a storage deposit
     * 
     * @param param
     * @param param.account The Account to unregister
     * @param param.force Whether to remove the account without claiming the storage deposit
     */
    public async unregisterAccount({ account, force = false }: { account: AccountLike, force: boolean }): Promise<any> {
        return account.callFunction({
            contractId: this.accountId,
            methodName: 'storage_unregister',
            args: { force },
            gas: '30000000000000',
            deposit: 1,
        });
    }
}

/**
 * The NEAR token is the native token of the NEAR blockchain
 */
export const NEAR = new NativeToken({
    name: 'NEAR',
    decimals: 24,
    symbol: 'NEAR',
    icon: 'data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20fill%3D%22white%22%3E%3C%2Fcircle%3E%3Cg%20clip-path%3D%22url(%23clip0000000003)%22%3E%3Cpath%20d%3D%22M20.8422%208.84471L17.4978%2013.776C17.4501%2013.847%2017.43%2013.9328%2017.4411%2014.0174C17.4522%2014.102%2017.4938%2014.1798%2017.5582%2014.2363C17.6225%2014.2928%2017.7053%2014.3243%2017.7913%2014.3249C17.8772%2014.3254%2017.9604%2014.2951%2018.0256%2014.2395L21.3178%2011.4036C21.3371%2011.3865%2021.361%2011.3753%2021.3866%2011.3714C21.4122%2011.3675%2021.4383%2011.3711%2021.4619%2011.3818C21.4855%2011.3924%2021.5054%2011.4096%2021.5193%2011.4314C21.5331%2011.4531%2021.5403%2011.4783%2021.54%2011.504V20.3824C21.54%2020.4095%2021.5316%2020.4361%2021.5158%2020.4583C21.5001%2020.4806%2021.4779%2020.4975%2021.4522%2020.5068C21.4265%2020.516%2021.3985%2020.5172%2021.3721%2020.5102C21.3456%2020.5031%2021.322%2020.4882%2021.3044%2020.4673L11.3533%208.63726C11.1933%208.44956%2010.994%208.29873%2010.7693%208.19525C10.5446%208.09178%2010.2999%208.03815%2010.0522%208.03809H9.70444C9.2524%208.03809%208.81887%208.21642%208.49922%208.53386C8.17957%208.8513%208%209.28185%208%209.73078V22.2351C8%2022.684%208.17957%2023.1145%208.49922%2023.432C8.81887%2023.7494%209.2524%2023.9277%209.70444%2023.9277V23.9277C9.99591%2023.9278%2010.2825%2023.8537%2010.537%2023.7125C10.7914%2023.5713%2011.0051%2023.3677%2011.1578%2023.1211L14.5022%2018.1898C14.5499%2018.1188%2014.57%2018.033%2014.5589%2017.9484C14.5478%2017.8638%2014.5062%2017.7861%2014.4418%2017.7295C14.3775%2017.673%2014.2947%2017.6415%2014.2087%2017.641C14.1228%2017.6404%2014.0396%2017.6707%2013.9744%2017.7264L10.6822%2020.5622C10.6629%2020.5794%2010.639%2020.5906%2010.6134%2020.5944C10.5878%2020.5983%2010.5617%2020.5947%2010.5381%2020.5841C10.5145%2020.5734%2010.4946%2020.5562%2010.4807%2020.5345C10.4669%2020.5128%2010.4597%2020.4875%2010.46%2020.4618V11.5813C10.46%2011.5541%2010.4684%2011.5276%2010.4842%2011.5053C10.4999%2011.483%2010.5221%2011.4661%2010.5478%2011.4568C10.5735%2011.4476%2010.6015%2011.4464%2010.6279%2011.4534C10.6544%2011.4605%2010.678%2011.4755%2010.6956%2011.4963L20.6456%2023.3286C20.8056%2023.5163%2021.0049%2023.6671%2021.2296%2023.7706C21.4543%2023.874%2021.699%2023.9277%2021.9467%2023.9277H22.2944C22.5184%2023.9279%2022.7401%2023.8842%2022.947%2023.7992C23.154%2023.7142%2023.342%2023.5895%2023.5004%2023.4324C23.6588%2023.2752%2023.7844%2023.0885%2023.8702%2022.8831C23.9559%2022.6776%2024%2022.4574%2024%2022.2351V9.73078C24%209.28185%2023.8204%208.8513%2023.5008%208.53386C23.1811%208.21642%2022.7476%208.03809%2022.2956%208.03809C22.0041%208.03801%2021.7175%208.11211%2021.4631%208.25332C21.2086%208.39453%2020.9949%208.59814%2020.8422%208.84471V8.84471Z%22%20fill%3D%22black%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cdefs%3E%3CclipPath%20id%3D%22clip00033%22%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22black%22%20transform%3D%22translate(8%207.9834)%22%3E%3C%2Frect%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3C%2Fsvg%3E'
});