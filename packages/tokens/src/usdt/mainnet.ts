import { FungibleToken } from '../fungible';

export class USDT extends FungibleToken {
    constructor() {
        super('dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near', {
            decimals: 6,
            symbol: 'USDT',
        });
    }
}
