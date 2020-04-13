const nearApi = require('../../lib/index');

exports.fuzz = input => {
    try {
        const deserialized = nearApi.utils.serialize.deserialize(nearApi.transactions.SCHEMA, nearApi.transactions.Transaction, input);
        const serialized = nearApi.utils.serialize.serialize(nearApi.transactions.SCHEMA, deserialized);
        if (!serialized.equals(input)) {
            console.log(`Mismatching output:\n${serialized.toString('hex')}\nand input:\n${input.toString('hex')}`);
            throw new Error('Mismatching input and output');
        }
    } catch(e) {
        if (e instanceof nearApi.utils.serialize.BorshError) {
            // Do nothing
        } else {
            throw e;
        }
    }
};