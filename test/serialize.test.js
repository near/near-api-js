
const nearlib = require('../lib/index');
const BN = require('BN.js');

class Test {
    constructor(x, y, z, q) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.q = q;
    }
}

test('serialize object', async () => {
    const value = new Test(10, 20, '123', [1, 2, 3]);
    const schema = { 'Test': [['x', 'u8'], ['y', 'u64'], ['z', 'string'], ['q', [3]]] };
    let buf = nearlib.utils.serialize.serialize(schema, value);
    let new_value = nearlib.utils.serialize.deserialize(schema, Test, buf);
    expect(new_value.x).toEqual(10);
    expect(new_value.y.toString()).toEqual('20');
    expect(new_value.z).toEqual('123');
    expect(new_value.q).toEqual(new Uint8Array([1, 2, 3]));
});
