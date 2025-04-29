import { FungibleToken } from '../fungible';

export class USDC extends FungibleToken {
    constructor() {
        super(
            '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1',
            {
                decimals: 6,
                symbol: 'USDC',
            }
        );
    }
}
