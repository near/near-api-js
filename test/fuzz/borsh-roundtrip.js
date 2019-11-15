const nearlib = require('../../lib/index');

exports.fuzz = input => {
    try {
        const deserialized = nearlib.utils.serialize.deserialize(nearlib.transactions.SCHEMA, nearlib.transactions.Transaction, input);
        const serialized = nearlib.utils.serialize.serialize(nearlib.transactions.SCHEMA, deserialized);
        if (!serialized.equals(input)) {
            console.log(`Mismatching output:\n${serialized.toString('hex')}\nand input:\n${input.toString('hex')}`);
            throw new Error('Mismatching input and output');
        }
    } catch(e) {
        if (e instanceof nearlib.utils.serialize.BorshError) {
            // Do nothing
        } else {
            throw e;
        }
    }
};