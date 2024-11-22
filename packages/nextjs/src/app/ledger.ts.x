"use client"
import { useLedgerSigner } from '@near-js/react';
import { useEffect, useState } from 'react';

export default function LedgerSigner() {
  const ledgerSigner = useLedgerSigner();
  const [publicKey, setPublicKey] = useState('');
  useEffect(() => {
    (async () => {
      setPublicKey((await ledgerSigner.getPublicKey()).toString());
    })();
  }, []);
  return (
    <h2>public key: {publicKey}</h2>
  );
}
