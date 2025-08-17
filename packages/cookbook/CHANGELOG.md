# @near-js/cookbook

## 2.2.5

## 2.2.4

## 2.2.3

## 2.2.2

## 2.2.1

## 2.2.0

## 2.1.0

### Patch Changes

- [#1581](https://github.com/near/near-api-js/pull/1581) [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63) Thanks [@r-near](https://github.com/r-near)! - Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.

- [#1577](https://github.com/near/near-api-js/pull/1577) [`99f3486`](https://github.com/near/near-api-js/commit/99f34864317725467a097dc3c7a3cc5f7a5b43d4) Thanks [@r-near](https://github.com/r-near)! - feat: add global contracts support to Account class

  Add `deployGlobalContract()` and `useGlobalContract()` methods to the Account class with simplified APIs for NEP-591 global contracts support.

  - `deployGlobalContract(code, deployMode)` accepts "codeHash" or "accountId" string literals
  - `useGlobalContract(contractIdentifier)` auto-detects string (account ID) or Uint8Array (code hash) parameters
  - Includes cookbook example demonstrating usage patterns

  This enables developers to easily deploy and use global contracts without manually creating complex type objects.

## 2.0.3

## 2.0.2

### Patch Changes

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

## 2.0.0

### Major Changes

- [#1513](https://github.com/near/near-api-js/pull/1513) [`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27) Thanks [@denbite](https://github.com/denbite)! - Major update for Signer and Account APIs to streamline development

## 1.0.23

### Patch Changes

- [#1401](https://github.com/near/near-api-js/pull/1401) [`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40) Thanks [@andy-haynes](https://github.com/andy-haynes)! - @near-js/client package

## 1.0.22

### Patch Changes

- Updated dependencies [[`73690557`](https://github.com/near/near-api-js/commit/73690557c8e2a74386fca62f4ae123abe0651403)]:
  - @near-js/accounts@1.3.0
  - @near-js/keystores-node@0.1.0
  - near-api-js@5.0.0
  - @near-js/providers@1.0.0
  - @near-js/signers@0.2.0
  - @near-js/transactions@1.3.0

## 1.0.21

### Patch Changes

- Updated dependencies [[`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/accounts@1.2.2
  - near-api-js@4.0.4
  - @near-js/signers@0.1.5
  - @near-js/transactions@1.2.3
  - @near-js/keystores-node@0.0.13
  - @near-js/providers@0.2.3

## 1.0.20

### Patch Changes

- Updated dependencies [[`e90e648c`](https://github.com/near/near-api-js/commit/e90e648ca4d6c3505141ad2ec666bbd9375b1289)]:
  - near-api-js@4.0.3

## 1.0.19

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/providers@0.2.2
  - @near-js/accounts@1.2.1
  - near-api-js@4.0.2
  - @near-js/transactions@1.2.2
  - @near-js/keystores-node@0.0.12
  - @near-js/signers@0.1.4

## 1.0.18

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/accounts@1.2.0
  - near-api-js@4.0.1
  - @near-js/providers@0.2.1
  - @near-js/transactions@1.2.1
  - @near-js/keystores-node@0.0.11
  - @near-js/signers@0.1.3

## 1.0.17

### Patch Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b), [`cc401a6c`](https://github.com/near/near-api-js/commit/cc401a6c893398e2185c35765ca316f68ac86074), [`3f363113`](https://github.com/near/near-api-js/commit/3f363113e102d0acf29b7b2635acf6160a028cc3), [`f739324b`](https://github.com/near/near-api-js/commit/f739324b2959712281d957eb26a09e5d68e32c80)]:
  - near-api-js@4.0.0
  - @near-js/accounts@1.1.0
  - @near-js/transactions@1.2.0
  - @near-js/providers@0.2.0
  - @near-js/keystores-node@0.0.10
  - @near-js/signers@0.1.2

## 1.0.16

### Patch Changes

- Updated dependencies [[`42dc7e2a`](https://github.com/near/near-api-js/commit/42dc7e2ac794e973987bed7b89da5ef2d3c6c8ac)]:
  - @near-js/transactions@1.1.2
  - @near-js/accounts@1.0.4
  - near-api-js@3.0.4
  - @near-js/providers@0.1.1

## 1.0.15

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6)]:
  - @near-js/providers@0.1.0
  - @near-js/accounts@1.0.3
  - near-api-js@3.0.3
  - @near-js/transactions@1.1.1
  - @near-js/keystores-node@0.0.9
  - @near-js/signers@0.1.1

## 1.0.14

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f)]:
  - @near-js/signers@0.1.0
  - @near-js/transactions@1.1.0
  - @near-js/accounts@1.0.2
  - @near-js/keystores-node@0.0.8
  - near-api-js@3.0.2
  - @near-js/providers@0.0.10

## 1.0.13

### Patch Changes

- Updated dependencies []:
  - @near-js/accounts@1.0.1
  - @near-js/keystores-node@0.0.7
  - near-api-js@3.0.1
  - @near-js/signers@0.0.7
  - @near-js/transactions@1.0.1
  - @near-js/providers@0.0.9

## 1.0.12

### Patch Changes

- Updated dependencies [[`0f764ee0`](https://github.com/near/near-api-js/commit/0f764ee03b5747fbf8a971c7b04ef8326238a1d0), [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`0be6c420`](https://github.com/near/near-api-js/commit/0be6c4209f56c0595bf66e217b7ac01444981b99), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f), [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9)]:
  - @near-js/accounts@1.0.0
  - near-api-js@3.0.0
  - @near-js/providers@0.0.8
  - @near-js/transactions@1.0.0
  - @near-js/keystores-node@0.0.6
  - @near-js/signers@0.0.6

## 1.0.11

### Patch Changes

- Updated dependencies []:
  - @near-js/accounts@0.1.4
  - @near-js/keystores-node@0.0.5
  - near-api-js@2.1.4
  - @near-js/signers@0.0.5
  - @near-js/transactions@0.2.1
  - @near-js/providers@0.0.7

## 1.0.10

### Patch Changes

- Updated dependencies [[`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342), [`00b4d2ba`](https://github.com/near/near-api-js/commit/00b4d2ba3f9f3a1f90343e34cb9bde8cdb607ceb)]:
  - @near-js/transactions@0.2.0
  - @near-js/accounts@0.1.3
  - near-api-js@2.1.3
  - @near-js/providers@0.0.6

## 1.0.9

### Patch Changes

- Updated dependencies [[`c1dcf3b8`](https://github.com/near/near-api-js/commit/c1dcf3b8207e7de358e1d711d55da938d5d9ff8d)]:
  - near-api-js@2.1.2
  - @near-js/accounts@0.1.2
  - @near-js/providers@0.0.5
  - @near-js/transactions@0.1.1
  - @near-js/keystores-node@0.0.4
  - @near-js/signers@0.0.4

## 1.0.8

### Patch Changes

- Updated dependencies [[`d6d53ab1`](https://github.com/near/near-api-js/commit/d6d53ab1b90e3d4041080dd4a6e22d24900c1ca5)]:
  - @near-js/providers@0.0.4
  - @near-js/accounts@0.1.1
  - near-api-js@2.1.1

## 1.0.7

### Patch Changes

- [#1097](https://github.com/near/near-api-js/pull/1097) [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Add support for delegate actions and meta transactions

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`b7b6c6a1`](https://github.com/near/near-api-js/commit/b7b6c6a1448050f60f6498f799654204f1998b91), [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e), [`4704ee77`](https://github.com/near/near-api-js/commit/4704ee7717d9e92e7729037368e7ace84a9c7f1c)]:
  - near-api-js@2.1.0
  - @near-js/providers@0.0.3
  - @near-js/accounts@0.1.0
  - @near-js/transactions@0.1.0
  - @near-js/keystores-node@0.0.3
  - @near-js/signers@0.0.3

## 1.0.6

### Patch Changes

- Updated dependencies [[`94311587`](https://github.com/near/near-api-js/commit/94311587ece172fb3e4d009ca0ecbfe9cea4447a)]:
  - near-api-js@2.0.4

## 1.0.5

### Patch Changes

- Updated dependencies []:
  - near-api-js@2.0.3

## 1.0.4

### Patch Changes

- Updated dependencies [[`c1ffd501`](https://github.com/near/near-api-js/commit/c1ffd5016cd9bbc285c5ec2b63ff4403e675338e)]:
  - near-api-js@2.0.2

## 1.0.3

### Patch Changes

- Updated dependencies [[`4f9e3d4d`](https://github.com/near/near-api-js/commit/4f9e3d4d978adc4a073e0ae2cdba69c3e1600201)]:
  - near-api-js@2.0.1

## 1.0.2

### Patch Changes

- Updated dependencies [[`8ee564c0`](https://github.com/near/near-api-js/commit/8ee564c0f4786e3c9281892c73761bd6a9205074), [`8feb1997`](https://github.com/near/near-api-js/commit/8feb199733a770b25b63b0bbc7d79fc8b0b1683c), [`c740afc8`](https://github.com/near/near-api-js/commit/c740afc897208d26165c4f8b2aae6db70694e70b), [`b823ada7`](https://github.com/near/near-api-js/commit/b823ada740e64a45d4b9671fab791968b51de61a), [`726b7953`](https://github.com/near/near-api-js/commit/726b795312230357aa2bb8a8db8a217a0f18a663), [`0c85da12`](https://github.com/near/near-api-js/commit/0c85da123473017683b2a53f83652938488dd086)]:
  - near-api-js@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577), [`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577)]:
  - near-api-js@1.1.0
