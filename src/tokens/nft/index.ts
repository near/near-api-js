import type { Account } from '../../accounts/account.js';

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

    /**
     * Calls `nft_transfer` with 30 TGas and a deposit of 1 yoctoNEAR, paid by the sender.
     * @param params - NFT transfer options.
     * @param params.from - Account signing the transfer.
     * @param params.receiverId - Account receiving the NFT.
     * @param params.tokenId - Token identifier within this NFT contract.
     * @returns The decoded contract result. Does not perform receiver storage registration.
     */
    transfer({ from, receiverId, tokenId }: { from: Account; receiverId: string; tokenId: string }): Promise<any> {
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
