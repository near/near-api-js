import TransportNodeHidModule from '@ledgerhq/hw-transport-node-hid';
import { KeyType, PublicKey } from '@near-js/crypto';
import { createClient, getSupportedTransport } from 'near-ledger-js';

import { LEDGER_HD_PATH } from '../constants';
import type { MessageSigner } from '../interfaces';
import type Transport from '@ledgerhq/hw-transport';

interface LedgerSignerParams {
  transport: Transport;
  hdPath: string;
  cachePublicKey: boolean;
}

export async function getNearLedgerSigner({ transport, hdPath, cachePublicKey }: LedgerSignerParams) {
  if (!transport) {
    throw new Error('Invalid transport for ledger signer');
  }

  transport.setScrambleKey('NEAR');
  const client = await createClient(transport);
  let cachedKeyData: Uint8Array = null;

  return {
    async getPublicKey(): Promise<PublicKey> {
      let publicKeyData = cachePublicKey ? cachedKeyData : null;
      if (!publicKeyData) {
        publicKeyData = await client.getPublicKey();

        if (cachePublicKey) {
          cachedKeyData = publicKeyData;
        }
      }

      return new PublicKey({
        keyType: KeyType.ED25519,
        data: publicKeyData,
      });
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      return client.sign(m, hdPath);
    },
  };
}

export async function getBrowserLedgerSigner(hdPath: string = LEDGER_HD_PATH, cachePublicKey: boolean = false): Promise<MessageSigner> {
  return getNearLedgerSigner({ transport: await getSupportedTransport(), hdPath, cachePublicKey });
}

export async function getUsbLedgerSigner(hdPath: string = LEDGER_HD_PATH, cachePublicKey: boolean = false): Promise<MessageSigner> {
  return getNearLedgerSigner({ transport: await TransportNodeHidModule.create(), hdPath, cachePublicKey });
}
