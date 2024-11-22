"use client"
import {
  // KeystoreSigningContext,
  RpcContext,
  useAccessKeys,
  useBlock,
  useRpcProviderByNetwork,
  // useTransaction,
} from '@near-js/react';
import { useState } from 'react';

export default function Rpc() {
  const [finality, setFinality] = useState('optimistic');
  const [account, setAccount] = useState('gornt.testnet');
  const [providerNetwork, setProviderNetwork] = useState('testnet');

  const provider = useRpcProviderByNetwork(providerNetwork);

    return (
      <div className="grid grid-cols-6 grid-rows-2 gap-3">
          <div className="col-span-1 col-start-3">
            <label htmlFor="network" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Network</label>
            <select
              id="network"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setProviderNetwork(e.currentTarget.value)}
              value={providerNetwork}
            >
              <option value={'testnet'}>testnet</option>
              <option value={'mainnet'}>mainnet</option>
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="block" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Block Finality</label>
            <select
              id="block"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setFinality(e.currentTarget.value)}
              value={finality}
            >
              <option value={'optimistic'}>optimistic</option>
              <option value={'final'}>final</option>
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="account" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account</label>
            <input type="account" id="account" value={account} onChange={(e) => setAccount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          </div>
          <RpcContext.Provider value={{ network: providerNetwork, provider }}>
            <div className="col-span-2">
              <AccessKeys account={account} />
            </div>
            <div className="col-span-2">
              <BlockHeight finality={finality} />
            </div>
          </RpcContext.Provider>
      </div>
    );
}

function AccessKeys({ account }: { account: string }) {
  const accessKeys = useAccessKeys({
    account,
  });

  return (
    <div className="grid grid-cols-1">
      <div>
        Full Access Keys
      </div>
      <div>
        {accessKeys?.fullAccessKeys.map(({ nonce, publicKey }, i) => (
          <div key={i} className="grid grid-cols-2">
            <div className="pl-3">
              {publicKey.slice(0, 16)}...
            </div>
            <div className="pl-3">
              {nonce.toString().slice(0, 6)}...{nonce.toString().slice(-3)}
            </div>
          </div>
        ))}
      </div>
      <div>
        Function Call Access Keys
      </div>
      <div>
        {accessKeys?.functionCallAccessKeys.map(({ contract, methods, nonce, publicKey }, i) => (
          <div key={i} className="grid grid-cols-5">
            <div className="pl-3">
              {publicKey.slice(0, 16)}...
            </div>
            <div className="pl-3">
              {nonce.toString().slice(0, 6)}...{nonce.toString().slice(-3)}
            </div>
            <div className="pl-3">
              {contract}
            </div>
            <div className="pl-3">
              {methods.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // return (
  //   <ul className="list-inside">
  //     {accessKeys?.functionCallAccessKeys.map(({ allowance, contract, methods, nonce, publicKey }, i) => (
  //       <li key={i}>
  //         {contract}[{methods.join(',')}]@{allowance}:{publicKey.split(':')[1].slice(0,8)}:{nonce}
  //       </li>
  //     ))}
  //   </ul>
  // )
}

function BlockHeight({ finality }: { finality: string }) {
  const block = useBlock({ blockReference: { finality } });
  return (<h2>{finality}: {block?.header?.height || '...'}</h2>);
}

// function Transaction({ account, transactionHash }: { account: string, transactionHash: string }) {
//   const transaction = useTransaction({ account, transactionHash });
//   if (!transaction) {
//       return (<span>...</span>)
//   }
//   return (<h2>{JSON.stringify(transaction?.transaction, null, 2)}</h2>);
// }
