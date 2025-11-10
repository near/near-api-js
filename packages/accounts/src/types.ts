/** @deprecated Will be removed in the next major release */
export enum MultisigDeleteRequestRejectionError {
    CANNOT_DESERIALIZE_STATE = 'Cannot deserialize the contract state',
    MULTISIG_NOT_INITIALIZED = 'Smart contract panicked: Multisig contract should be initialized before usage',
    NO_SUCH_REQUEST = "Smart contract panicked: panicked at 'No such request: either wrong number or already confirmed'",
    REQUEST_COOLDOWN_ERROR = 'Request cannot be deleted immediately after creation.',
    METHOD_NOT_FOUND = 'Contract method is not found',
}

/** @deprecated Will be removed in the next major release */
export enum MultisigStateStatus {
    INVALID_STATE,
    STATE_NOT_INITIALIZED,
    VALID_STATE,
    UNKNOWN_STATE,
}
