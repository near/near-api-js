
const nearApi = require('../lib/index');
const BN = require('bn.js');

test('find seat price', async () => {
    expect(nearApi.validators.findSeatPrice(
        [{stake: "1000000"}, {stake: "1000000"}, {stake: "10"}], 10)).toEqual(new BN("200000"));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: "1000000000" }, { stake: "10" }], 10)).toEqual(new BN("100000000"));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: "1000000000" }], 1000000000)).toEqual(new BN("1"));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: "1000" }, { stake: "1" }, { stake: "1" }, { stake: "1" }, { stake: "1" }, { stake: "1" }, { stake: "1" }, { stake: "1" }, { stake: "1" }], 1)).toEqual(new BN("1000"));
    expect(() => {nearApi.validators.findSeatPrice(
        [{ stake: "1" }, { stake: "1" }, { stake: "2" }], 100)}).toThrow();
});
