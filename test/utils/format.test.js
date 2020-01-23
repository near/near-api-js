// Unit tests for simple util code

const nearlib = require('../../lib/index');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

test('formatting yoctonear amounts', async() => {
    expect(nearlib.utils.format.formatNearAmount('8999999999837087887')).toEqual('0.000008999999999837087887');
    expect(nearlib.utils.format.formatNearAmount('8099099999837087887')).toEqual('0.000008099099999837087887');
    expect(nearlib.utils.format.formatNearAmount('8099099999837087887')).not.toEqual('0.000008099099999837087888');
    expect(nearlib.utils.format.formatNearAmount('999998999999999837087887000')).toEqual('999.998999999999837087887');
    expect(nearlib.utils.format.formatNearAmount('1'+'0'.repeat(13))).toEqual('0.00000000001');
    expect(nearlib.utils.format.formatNearAmount('9999989999999998370878870000000')).toEqual('9,999,989.99999999837087887');
    expect(nearlib.utils.format.formatNearAmount('000000000000000000000000')).toEqual('0');
    expect(nearlib.utils.format.formatNearAmount('1000000000000000000000000')).toEqual('1');
    expect(nearlib.utils.format.formatNearAmount('999999999999999999000000')).toEqual('0.999999999999999999');
    expect(nearlib.utils.format.formatNearAmount('999999999999999999000000', 10)).toEqual('1');
    expect(nearlib.utils.format.formatNearAmount('1003000000000000000000000', 3)).toEqual('1.003');
    expect(nearlib.utils.format.formatNearAmount('3000000000000000000000', 3)).toEqual('0.003');
    expect(nearlib.utils.format.formatNearAmount('3000000000000000000000', 4)).toEqual('0.003'); 
    expect(nearlib.utils.format.formatNearAmount('3500000000000000000000', 3)).toEqual('0.004');
    expect(nearlib.utils.format.formatNearAmount('03500000000000000000000', 3)).toEqual('0.004');
    expect(nearlib.utils.format.formatNearAmount('10000000999999997410000000')).toEqual('10.00000099999999741');
    expect(nearlib.utils.format.formatNearAmount('10100000999999997410000000')).toEqual('10.10000099999999741');
    expect(nearlib.utils.format.formatNearAmount('10040000999999997410000000', 2)).toEqual('10.04');
    expect(nearlib.utils.format.formatNearAmount('10999000999999997410000000', 2)).toEqual('11');
    expect(nearlib.utils.format.formatNearAmount('1000000100000000000000000000000')).toEqual('1,000,000.1');
    expect(nearlib.utils.format.formatNearAmount('1000100000000000000000000000000')).toEqual('1,000,100');
    expect(nearlib.utils.format.formatNearAmount('910000000000000000000000', 0)).toEqual('1');
});

test('converting near to account balance units', async() => {
    expect(nearlib.utils.format.parseNearAmount(null)).toEqual(null);
    expect(nearlib.utils.format.parseNearAmount('5.3')).toEqual('5300000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('5')).toEqual('5000000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('1')).toEqual('1000000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('10')).toEqual('10000000000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('0.000008999999999837087887')).toEqual('8999999999837087887');
    expect(nearlib.utils.format.parseNearAmount('0.000008099099999837087887')).toEqual('8099099999837087887');
    expect(nearlib.utils.format.parseNearAmount('0.000008099099999837087887')).not.toEqual('8099099999837087888');
    expect(nearlib.utils.format.parseNearAmount('999.998999999999837087887000')).toEqual('999998999999999837087887000');
    expect(nearlib.utils.format.parseNearAmount('0.000000000000001')).toEqual('1000000000');
    expect(nearlib.utils.format.parseNearAmount('0.000001')).toEqual('1000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('.000001')).toEqual('1000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('000000.000001')).toEqual('1000000000000000000');
    expect(nearlib.utils.format.parseNearAmount('1,000,000.1')).toEqual('1000000100000000000000000000000');

    try  {
        // Too many decimals
        expect(nearlib.utils.format.parseNearAmount('0.0000080990999998370878871')).toFail();
    } catch (e) {
        expect(e.toString()).toEqual('Error: Cannot parse \'0.0000080990999998370878871\' as NEAR amount');
    }
});
