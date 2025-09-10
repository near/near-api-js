import {
    createKey,
    getKeys,
    isDeviceSupported,
    isPassKeyAvailable,
} from "@near-js/biometric-ed25519";
import { expect, test } from "vitest";

test(`exports "createKey" function`, () => {
    expect(createKey).toBeDefined();
});

test(`exports "getKeys" function`, () => {
    expect(getKeys).toBeDefined();
});

test(`exports "isDeviceSupported" function`, () => {
    expect(isDeviceSupported).toBeDefined();
});

test(`exports "isPassKeyAvailable" function`, () => {
    expect(isPassKeyAvailable).toBeDefined();
});
