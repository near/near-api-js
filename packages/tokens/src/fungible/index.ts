import { Token, TokenMetadata } from '../token';

/** Fungible Token deployed as a contract */
export class FungibleToken extends Token {
    public readonly contractId: string;

    constructor(contractId: string, metadata: TokenMetadata) {
        super(metadata);
        this.contractId = contractId;
    }
}
