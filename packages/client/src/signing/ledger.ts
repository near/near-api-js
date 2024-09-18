import TransportNodeHidModule from '@ledgerhq/hw-transport-node-hid';
import { KeyType, PublicKey } from '@near-js/crypto';
import { createClient, getSupportedTransport } from 'near-ledger-js';

import { LEDGER_HD_PATH } from '../constants';
import type { MessageSigner } from '../interfaces';

export async function getNearLedgerSigner(transport: any, hdPath: string) {
  if (!transport) {
    throw new Error('Invalid transport for ledger signer');
  }

  transport.setScrambleKey('NEAR');
  const client = await createClient(transport);
  return {
    async getPublicKey(): Promise<PublicKey> {
      return new PublicKey({
        keyType: KeyType.ED25519,
        data: await client.getPublicKey(),
      });
    },
    async signMessage(m: Uint8Array): Promise<Uint8Array> {
      return client.sign(m, hdPath);
    },
  };
}

export async function getBrowserLedgerSigner(hdPath: string = LEDGER_HD_PATH): Promise<MessageSigner> {
  return getNearLedgerSigner(await getSupportedTransport(), hdPath);
}

export async function getUsbLedgerSigner(hdPath: string = LEDGER_HD_PATH): Promise<MessageSigner> {
  return getNearLedgerSigner(await TransportNodeHidModule.create(), hdPath);
}
