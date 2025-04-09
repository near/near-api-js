import { getTestnetRpcProvider } from '@near-js/client';
import { KeyType, PublicKey } from '@near-js/crypto';
import { baseDecode } from '@near-js/utils';

const ACCOUNT_ID = 'gornt.testnet';
const TX_HASH = '4tMHzHU5p9dXc4WqopReNZ2TMJxZyu913zK4Fn9nMRoB';

export default async function verifySignature(accountId: string = ACCOUNT_ID, transactionHash: string = TX_HASH) {
  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();

  const { transaction: { public_key, signature } } = await rpcProvider.viewTransactionStatus(transactionHash, accountId, 'FINAL');

  const hashBytes = baseDecode(transactionHash);
  const publicKeyBytes = baseDecode(public_key.slice('ed25519:'.length));
  const signatureBytes = baseDecode(signature.slice('ed25519:'.length));
  const publicKey = new PublicKey({ keyType: KeyType.ED25519, data: publicKeyBytes });

  const isVerified = publicKey.verify(hashBytes, signatureBytes);

  console.log(isVerified);
}
