import { getTestnetRpcProvider, getUsbLedgerSigner, SignedTransactionComposer } from '@near-js/client';

export default async function signWithLedger() {
  const ledgerSigner = await getUsbLedgerSigner();
  const publicKey = await ledgerSigner.getPublicKey();

  const rpcProvider = getTestnetRpcProvider();

  const { signedTransaction: { signature: { data } } } = await SignedTransactionComposer.init({
    sender: 'a.testnet',
    receiver: 'b.testnet',
    nonce: 100n,
    blockHeader: (await rpcProvider.block({ finality: 'optimistic' })).header,
    publicKey,
    deps: {
      rpcProvider,
      signer: ledgerSigner,
    }
  })
    .transfer(100n)
    .toSignedTransaction();

  console.log(`Signed message with ledger key ${publicKey}: ${Buffer.from(data).toString('base64')}`);
}
