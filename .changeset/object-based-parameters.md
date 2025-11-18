---
"near-api-js": major
---

Convert all inline/positional parameters to object-based parameters throughout the API

**Breaking Changes:**

All functions that previously used positional parameters now use object-based parameters for consistency and better developer experience:

**Transaction Creation:**
- `createTransaction(signerId, publicKey, receiverId, nonce, actions, blockHash)` → `createTransaction({ signerId, publicKey, receiverId, nonce, actions, blockHash })`

**Action Creators:**
- `functionCall(methodName, args, gas, deposit)` → `functionCall({ methodName, args, gas, deposit })`
- `functionCallAccessKey(methodNames, receiverId, allowance)` → `functionCallAccessKey({ methodNames, receiverId, allowance })`
- `stake(stake, publicKey)` → `stake({ stake, publicKey })`
- `addKey(publicKey, accessKey)` → `addKey({ publicKey, accessKey })`
- `deployGlobalContract(code, deployMode)` → `deployGlobalContract({ code, deployMode })`

**Provider Methods:**
- `viewBlock(blockId/finality)` → `viewBlock({ blockQuery: { blockId/finality } })`
- `viewChunk(chunkId)` → `viewChunk({ chunkId })`
- `viewGasPrice(blockId)` → `viewGasPrice({ blockId })`
- `viewTransactionStatus(txHash, accountId, waitUntil)` → `viewTransactionStatus({ txHash, accountId, waitUntil })`
- `experimental_protocolConfig(blockReference)` → `experimental_protocolConfig({ blockReference })`
- `lightClientProof(request)` → `lightClientProof({ request })`
- `nextLightClientBlock(request)` → `nextLightClientBlock({ request })`
- And many more provider methods...

**Account Methods:**
- `createSignedMetaTransaction(receiverId, actions)` → `createSignedMetaTransaction({ receiverId, actions })`

This change provides better IDE auto-completion, makes the API more self-documenting, and allows for easier future extensibility without breaking existing code.
