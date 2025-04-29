import { FungibleToken } from '../fungible';

export class USDT extends FungibleToken {
    constructor() {
        super('usdt.fakes.testnet', {
            decimals: 6,
            symbol: 'USDT',
        });
    }
}
