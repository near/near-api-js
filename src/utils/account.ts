const NAMED_ACCOUNT_ID_REGEX =  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const IMPLICIT_ACCOUNT_ID_REGEX = /^[a-f0-9]{64}$/;

/*
 * Validate a NEAR account ID.
 */
export const isValidId = (address: string): boolean => {
    if (isImplicitAccount(address)) {
        return IMPLICIT_ACCOUNT_ID_REGEX.test(address);
    }

    return NAMED_ACCOUNT_ID_REGEX.test(address);
};

export const isImplicitAccount = (address: string): boolean => {
    return !address.includes('.');
};
