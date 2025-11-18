---
"near-api-js": major
---

Convert exported user-facing APIs to use object-based parameters for better developer experience

**Breaking Changes:**

User-facing APIs that previously used positional parameters now use object-based parameters for consistency and better developer experience. Internal functions remain unchanged with positional parameters.

**Action Creators (exported via `actionCreators`):**
- `functionCall(methodName, args, gas, deposit)` → `functionCall({ methodName, args, gas, deposit })`
- `functionCallAccessKey(receiverId, methodNames, allowance)` → `functionCallAccessKey({ receiverId, methodNames, allowance })`
- `stake(stake, publicKey)` → `stake({ stake, publicKey })`
- `addKey(publicKey, accessKey)` → `addKey({ publicKey, accessKey })`
- `deployGlobalContract(code, deployMode)` → `deployGlobalContract({ code, deployMode })`

**Provider Methods:**
- `viewBlock(blockId/finality)` → `viewBlock({ blockQuery: { blockId/finality } })`
- `viewChunk(chunkId)` → `viewChunk({ chunkId })`
- `viewGasPrice(blockId)` → `viewGasPrice({ blockId })`
- `viewTransactionStatus(txHash, accountId, waitUntil)` → `viewTransactionStatus({ txHash, accountId, waitUntil })`
- `viewTransactionStatusWithReceipts(txHash, accountId, waitUntil)` → `viewTransactionStatusWithReceipts({ txHash, accountId, waitUntil })`
- `experimental_protocolConfig(blockReference)` → `experimental_protocolConfig({ blockReference })`
- `lightClientProof(request)` → `lightClientProof({ request })`
- `nextLightClientBlock(request)` → `nextLightClientBlock({ request })`
- `blockChanges(blockQuery)` → `blockChanges({ blockQuery })`
- `callFunction(contractId, method, args, blockQuery)` → `callFunction({ contractId, method, args, blockQuery })`
- And all other provider methods...

**Account Methods:**
- `createAccount(newAccountId, publicKey, nearToTransfer)` → `createAccount({ newAccountId, publicKey, nearToTransfer })`
- `deleteAccount(beneficiaryId)` → `deleteAccount({ beneficiaryId })`
- `deployContract(data)` → `deployContract({ data })`
- `functionCall(params)` → `functionCall({ contractId, methodName, args, gas, attachedDeposit })`
- `sendMoney(receiverId, amount)` → `sendMoney({ receiverId, amount })`
- `createTransaction(receiverId, actions, publicKey)` → `createTransaction({ receiverId, actions, publicKey })`
- `createSignedMetaTransaction(receiverId, actions, blockHeightTtl)` → `createSignedMetaTransaction({ receiverId, actions, blockHeightTtl })`
- `signAndSendTransaction(receiverId, actions, throwOnFailure, waitUntil)` → `signAndSendTransaction({ receiverId, actions, throwOnFailure, waitUntil })`
- And all other account methods...

**Internal functions remain positional:**
- `createTransaction()` - internal transaction builder
- `buildDelegateAction()` - internal delegate action builder

This change provides better IDE auto-completion, makes the API more self-documenting, and allows for easier future extensibility without breaking existing code.
