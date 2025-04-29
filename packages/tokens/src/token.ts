import { formatAmount, parseAmount } from "./format";

export interface TokenMetadata {
    decimals: number;
    symbol: string;
}

export abstract class Token {
    public readonly metadata: TokenMetadata;

    constructor(metadata: TokenMetadata) {
        this.metadata = metadata;
    }

    public toUnits(amount: string | number): bigint {
        const units = parseAmount(amount.toString(), this.metadata.decimals);

        return BigInt(units);
    }

    public toAmount(units: bigint | string | number): string {
        return formatAmount(units, this.metadata.decimals);
    }
}
