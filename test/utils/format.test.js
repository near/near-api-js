// Unit tests for simple util code
/*
const nearlib = require('../../lib/index');


jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
});

beforeEach(async () => {
});

*/
test('formatting attonear amounts', async() => {
    /*expect(nearlib.utils.format.formatNearAmount('8999999999837087887')).toEqual('0.000008999999999837087887');
    expect(nearlib.utils.format.formatNearAmount('8099099999837087887')).toEqual('0.000008099099999837087887');
    expect(nearlib.utils.format.formatNearAmount('8099099999837087887')).not.toEqual('0.000008099099999837087888');
    expect(nearlib.utils.format.formatNearAmount('999998999999999837087887000')).toEqual('999.998999999999837087887');
    expect(nearlib.utils.format.formatNearAmount('1'+'0'.repeat(13))).toEqual('0.00000000001');
    expect(nearlib.utils.format.formatNearAmount('9999989999999998370878870000000')).toEqual('9,999,989.99999999837087887');
    // TODO: do not format smaller values */
});

/*
test('converting near to account balance units', async() => {
    expect(nearlib.utils.format.parseNearAmount(null)).toEqual(null);
    expect(nearlib.utils.format.parseNearAmount('5.3')).toEqual('5300000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('5')).toEqual('5000000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('0.000008999999999837087887')).toEqual('8999999999837087887');
    expect(nearlib.utils.format.parseNearAmount('0.000008099099999837087887')).toEqual('8099099999837087887');
    expect(nearlib.utils.format.parseNearAmount('0.000008099099999837087887')).not.toEqual('8099099999837087888');
    expect(nearlib.utils.format.parseNearAmount('999.998999999999837087887000')).toEqual('999998999999999837087887000');
    expect(nearlib.utils.format.parseNearAmount('0.000000000000001')).toEqual('1000000000');
    expect(nearlib.utils.format.parseNearAmount('0.000001')).toEqual('1000000000000000000');
    
  
    try  {
        // Too many decimals
        expect(nearlib.utils.format.parseNearAmount('0.0000080990999998370878871')).toFail();
    } catch (e) {
        expect(e.toString()).toEqual('Error: Cannot parse \'0.0000080990999998370878871\' as NEAR amount');
    }
}); */