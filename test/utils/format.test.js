// Unit tests for simple util code

const nearlib = require('../../lib/index');


jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

beforeAll(async () => {
});

beforeEach(async () => {
});

test('formatting attonear amounts', async() => {
    expect(nearlib.utils.format.convertAccountBalanceAmountToNear('8999999999837087887')).toEqual('0.000008999999999837087887');
    expect(nearlib.utils.format.convertAccountBalanceAmountToNear('8099099999837087887')).toEqual('0.000008099099999837087887');
    expect(nearlib.utils.format.convertAccountBalanceAmountToNear('8099099999837087887')).not.toEqual('0.000008099099999837087888');
    expect(nearlib.utils.format.convertAccountBalanceAmountToNear('999998999999999837087887000')).toEqual('999.998999999999837087887000');
    // TODO: do not format smaller values
});

test('converting near to account balance units', async() => {
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount(null)).toEqual(null);
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('5.3')).toEqual('5300000000000000000000000');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('5')).toEqual('5000000000000000000000000');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.000008999999999837087887')).toEqual('8999999999837087887');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.000008099099999837087887')).toEqual('8099099999837087887');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.000008099099999837087887')).not.toEqual('8099099999837087888');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('999.998999999999837087887000')).toEqual('999998999999999837087887000');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.000000000000001')).toEqual('1000000000');
    expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.000001')).toEqual('1000000000000000000');
    
  
    try  {
        // Too many decimals
        expect(nearlib.utils.format.nearAmountToAccountBalanceAmount('0.0000080990999998370878871')).toFail();
    } catch (e) {
        expect(e.toString()).toEqual('Error: Invalid input format');
    }
});