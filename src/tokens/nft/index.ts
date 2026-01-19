import type { AccountLike } from '../../types/index.js';

interface ContractMetadata {
    spec?: string;
    name: string;
    symbol: string;
    icon?: string;
    baseUri?: string;
    reference?: string;
    referenceHash?: string;
}

interface NFTMetadata {
    title?: string;
    description?: string;
    media?: string;
    mediaHash?: string;
    copies?: number;
    issuedAt?: string;
    expiresAt?: string;
    startsAt?: string;
    updatedAt?: string;
    extra?: string;
    reference?: string;
    referenceHash?: string;
}

export class NFTContract {
    public readonly metadata: ContractMetadata;
    public readonly accountId: string;

    constructor(accountId: string, metadata: ContractMetadata) {
        metadata.spec = metadata.spec || 'nft-1.0.0';
        this.metadata = metadata;
        this.accountId = accountId;
    }

    transfer({ from, receiverId, tokenId }: { from: AccountLike; receiverId: string; tokenId: string }): Promise<any> {
        return from.callFunction({
            contractId: this.accountId,
            methodName: 'nft_transfer',
            args: {
                receiver_id: receiverId,
                token_id: tokenId,
            },
            deposit: 1,
            gas: 30000000000000,
        });
    }
}

export class NonFungibleToken {
    public readonly contractId: string;
    public readonly tokenId: string;
    public readonly ownerId: string;
    public readonly metadata: NFTMetadata;

    constructor(contractId: string, tokenId: string, ownerId: string, metadata: NFTMetadata) {
        this.contractId = contractId;
        this.tokenId = tokenId;
        this.ownerId = ownerId;
        this.metadata = metadata;
    }
}
