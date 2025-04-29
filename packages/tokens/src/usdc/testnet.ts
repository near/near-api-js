import { FungibleToken } from '../fungible';

export class USDC extends FungibleToken {
    constructor() {
        super('usdc.fakes.testnet', {
            decimals: 6,
            symbol: 'USDC',
        });
    }
}
