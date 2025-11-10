import {
    createKey,
    getKeys,
    isDeviceSupported,
    isPassKeyAvailable,
} from "@near-js/biometric-ed25519";
import { KeyPair } from "@near-js/crypto";
import { expectTypeOf, test } from "bun:test";

test(`exports "createKey" function with correct type`, async () => {
    type ExpectedFunction = (username: string) => Promise<KeyPair>;

    expectTypeOf(createKey).toEqualTypeOf<ExpectedFunction>();
});

test(`exports "getKeys" function with correct type`, async () => {
    type ExpectedFunction = (username: string) => Promise<[KeyPair, KeyPair]>;

    expectTypeOf(getKeys).toEqualTypeOf<ExpectedFunction>();
});

test(`exports "isDeviceSupported" function with correct type`, async () => {
    type ExpectedFunction = () => Promise<boolean>;

    expectTypeOf(isDeviceSupported).toEqualTypeOf<ExpectedFunction>();
});

test(`exports "isPassKeyAvailable" function with correct type`, async () => {
    type ExpectedFunction = () => Promise<boolean>;

    expectTypeOf(isPassKeyAvailable).toEqualTypeOf<ExpectedFunction>();
});
