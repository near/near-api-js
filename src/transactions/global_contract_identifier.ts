import { baseDecode } from '../utils/index.js';
import { GlobalContractIdentifier } from './actions.js';

export type GlobalContractIdentifierInput = { accountId: string } | { codeHash: string | Uint8Array };

/** Hashes returned by RPC are base58; 64-character hexadecimal hashes remain supported. */
export function globalContractIdentifier(contractIdentifier: GlobalContractIdentifierInput): GlobalContractIdentifier {
    return 'accountId' in contractIdentifier
        ? new GlobalContractIdentifier({
              AccountId: contractIdentifier.accountId,
          })
        : new GlobalContractIdentifier({
              CodeHash:
                  typeof contractIdentifier.codeHash === 'string'
                      ? /^[0-9a-fA-F]{64}$/.test(contractIdentifier.codeHash)
                          ? new Uint8Array(
                                contractIdentifier.codeHash.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
                            )
                          : baseDecode(contractIdentifier.codeHash)
                      : contractIdentifier.codeHash,
          });
}
