/**
 * This code is copied verbatim from 
 * https://github.com/cryptocoinjs/bs58/blob/master/ts_src/index.ts
 * because 
 * 1. Its very minimal middleware.
 * 2. The latest version (v6.0.0) has an incorrect build.
 *      https://www.npmjs.com/package/bs58/v/6.0.0
 * 3. It doesn't doesn't actively update the primary dependency: 
 *      https://www.npmjs.com/package/base-x
 */ 
import basex from "base-x";
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export default basex(ALPHABET);