const nearAPIJs = require('../../lib/index');

exports.fuzz = input => {
    try {
        const deserialized = nearAPIJs.utils.serialize.deserialize(nearAPIJs.transactions.SCHEMA, nearAPIJs.transactions.Transaction, input);
        const serialized = nearAPIJs.utils.serialize.serialize(nearAPIJs.transactions.SCHEMA, deserialized);
        if (!serialized.equals(input)) {
            console.log(`Mismatching output:\n${serialized.toString('hex')}\nand input:\n${input.toString('hex')}`);
            throw new Error('Mismatching input and output');
        }
    } catch(e) {
        if (e instanceof nearAPIJs.utils.serialize.BorshError) {
            // Do nothing
        } else {
            throw e;
        }
    }
};