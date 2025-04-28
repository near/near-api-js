import { Token } from '../token';

/** Native Near Token */
export class NearToken extends Token {
    constructor() {
        super({
            decimals: 24,
            symbol: 'NEAR',
        });
    }
}
