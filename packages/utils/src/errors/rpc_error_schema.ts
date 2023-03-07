export default {
    'schema': {
        'BadUTF16': {
            'name': 'BadUTF16',
            'subtypes': [],
            'props': {}
        },
        'BadUTF8': {
            'name': 'BadUTF8',
            'subtypes': [],
            'props': {}
        },
        'BalanceExceeded': {
            'name': 'BalanceExceeded',
            'subtypes': [],
            'props': {}
        },
        'BreakpointTrap': {
            'name': 'BreakpointTrap',
            'subtypes': [],
            'props': {}
        },
        'CacheError': {
            'name': 'CacheError',
            'subtypes': [
                'ReadError',
                'WriteError',
                'DeserializationError',
                'SerializationError'
            ],
            'props': {}
        },
        'CallIndirectOOB': {
            'name': 'CallIndirectOOB',
            'subtypes': [],
            'props': {}
        },
        'CannotAppendActionToJointPromise': {
            'name': 'CannotAppendActionToJointPromise',
            'subtypes': [],
            'props': {}
        },
        'CannotReturnJointPromise': {
            'name': 'CannotReturnJointPromise',
            'subtypes': [],
            'props': {}
        },
        'CodeDoesNotExist': {
            'name': 'CodeDoesNotExist',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'CompilationError': {
            'name': 'CompilationError',
            'subtypes': [
                'CodeDoesNotExist',
                'PrepareError',
                'WasmerCompileError'
            ],
            'props': {}
        },
        'ContractSizeExceeded': {
            'name': 'ContractSizeExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'size': ''
            }
        },
        'Deprecated': {
            'name': 'Deprecated',
            'subtypes': [],
            'props': {
                'method_name': ''
            }
        },
        'Deserialization': {
            'name': 'Deserialization',
            'subtypes': [],
            'props': {}
        },
        'DeserializationError': {
            'name': 'DeserializationError',
            'subtypes': [],
            'props': {}
        },
        'EmptyMethodName': {
            'name': 'EmptyMethodName',
            'subtypes': [],
            'props': {}
        },
        'FunctionCallError': {
            'name': 'FunctionCallError',
            'subtypes': [
                'CompilationError',
                'LinkError',
                'MethodResolveError',
                'WasmTrap',
                'WasmUnknownError',
                'HostError',
                'EvmError'
            ],
            'props': {}
        },
        'GasExceeded': {
            'name': 'GasExceeded',
            'subtypes': [],
            'props': {}
        },
        'GasInstrumentation': {
            'name': 'GasInstrumentation',
            'subtypes': [],
            'props': {}
        },
        'GasLimitExceeded': {
            'name': 'GasLimitExceeded',
            'subtypes': [],
            'props': {}
        },
        'GenericTrap': {
            'name': 'GenericTrap',
            'subtypes': [],
            'props': {}
        },
        'GuestPanic': {
            'name': 'GuestPanic',
            'subtypes': [],
            'props': {
                'panic_msg': ''
            }
        },
        'HostError': {
            'name': 'HostError',
            'subtypes': [
                'BadUTF16',
                'BadUTF8',
                'GasExceeded',
                'GasLimitExceeded',
                'BalanceExceeded',
                'EmptyMethodName',
                'GuestPanic',
                'IntegerOverflow',
                'InvalidPromiseIndex',
                'CannotAppendActionToJointPromise',
                'CannotReturnJointPromise',
                'InvalidPromiseResultIndex',
                'InvalidRegisterId',
                'IteratorWasInvalidated',
                'MemoryAccessViolation',
                'InvalidReceiptIndex',
                'InvalidIteratorIndex',
                'InvalidAccountId',
                'InvalidMethodName',
                'InvalidPublicKey',
                'ProhibitedInView',
                'NumberOfLogsExceeded',
                'KeyLengthExceeded',
                'ValueLengthExceeded',
                'TotalLogLengthExceeded',
                'NumberPromisesExceeded',
                'NumberInputDataDependenciesExceeded',
                'ReturnedValueLengthExceeded',
                'ContractSizeExceeded',
                'Deprecated'
            ],
            'props': {}
        },
        'IllegalArithmetic': {
            'name': 'IllegalArithmetic',
            'subtypes': [],
            'props': {}
        },
        'IncorrectCallIndirectSignature': {
            'name': 'IncorrectCallIndirectSignature',
            'subtypes': [],
            'props': {}
        },
        'Instantiate': {
            'name': 'Instantiate',
            'subtypes': [],
            'props': {}
        },
        'IntegerOverflow': {
            'name': 'IntegerOverflow',
            'subtypes': [],
            'props': {}
        },
        'InternalMemoryDeclared': {
            'name': 'InternalMemoryDeclared',
            'subtypes': [],
            'props': {}
        },
        'InvalidAccountId': {
            'name': 'InvalidAccountId',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'InvalidIteratorIndex': {
            'name': 'InvalidIteratorIndex',
            'subtypes': [],
            'props': {
                'iterator_index': ''
            }
        },
        'InvalidMethodName': {
            'name': 'InvalidMethodName',
            'subtypes': [],
            'props': {}
        },
        'InvalidPromiseIndex': {
            'name': 'InvalidPromiseIndex',
            'subtypes': [],
            'props': {
                'promise_idx': ''
            }
        },
        'InvalidPromiseResultIndex': {
            'name': 'InvalidPromiseResultIndex',
            'subtypes': [],
            'props': {
                'result_idx': ''
            }
        },
        'InvalidPublicKey': {
            'name': 'InvalidPublicKey',
            'subtypes': [],
            'props': {}
        },
        'InvalidReceiptIndex': {
            'name': 'InvalidReceiptIndex',
            'subtypes': [],
            'props': {
                'receipt_index': ''
            }
        },
        'InvalidRegisterId': {
            'name': 'InvalidRegisterId',
            'subtypes': [],
            'props': {
                'register_id': ''
            }
        },
        'IteratorWasInvalidated': {
            'name': 'IteratorWasInvalidated',
            'subtypes': [],
            'props': {
                'iterator_index': ''
            }
        },
        'KeyLengthExceeded': {
            'name': 'KeyLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'LinkError': {
            'name': 'LinkError',
            'subtypes': [],
            'props': {
                'msg': ''
            }
        },
        'Memory': {
            'name': 'Memory',
            'subtypes': [],
            'props': {}
        },
        'MemoryAccessViolation': {
            'name': 'MemoryAccessViolation',
            'subtypes': [],
            'props': {}
        },
        'MemoryOutOfBounds': {
            'name': 'MemoryOutOfBounds',
            'subtypes': [],
            'props': {}
        },
        'MethodEmptyName': {
            'name': 'MethodEmptyName',
            'subtypes': [],
            'props': {}
        },
        'MethodInvalidSignature': {
            'name': 'MethodInvalidSignature',
            'subtypes': [],
            'props': {}
        },
        'MethodNotFound': {
            'name': 'MethodNotFound',
            'subtypes': [],
            'props': {}
        },
        'MethodResolveError': {
            'name': 'MethodResolveError',
            'subtypes': [
                'MethodEmptyName',
                'MethodUTF8Error',
                'MethodNotFound',
                'MethodInvalidSignature'
            ],
            'props': {}
        },
        'MethodUTF8Error': {
            'name': 'MethodUTF8Error',
            'subtypes': [],
            'props': {}
        },
        'MisalignedAtomicAccess': {
            'name': 'MisalignedAtomicAccess',
            'subtypes': [],
            'props': {}
        },
        'NumberInputDataDependenciesExceeded': {
            'name': 'NumberInputDataDependenciesExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'number_of_input_data_dependencies': ''
            }
        },
        'NumberOfLogsExceeded': {
            'name': 'NumberOfLogsExceeded',
            'subtypes': [],
            'props': {
                'limit': ''
            }
        },
        'NumberPromisesExceeded': {
            'name': 'NumberPromisesExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'number_of_promises': ''
            }
        },
        'PrepareError': {
            'name': 'PrepareError',
            'subtypes': [
                'Serialization',
                'Deserialization',
                'InternalMemoryDeclared',
                'GasInstrumentation',
                'StackHeightInstrumentation',
                'Instantiate',
                'Memory'
            ],
            'props': {}
        },
        'ProhibitedInView': {
            'name': 'ProhibitedInView',
            'subtypes': [],
            'props': {
                'method_name': ''
            }
        },
        'ReadError': {
            'name': 'ReadError',
            'subtypes': [],
            'props': {}
        },
        'ReturnedValueLengthExceeded': {
            'name': 'ReturnedValueLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'Serialization': {
            'name': 'Serialization',
            'subtypes': [],
            'props': {}
        },
        'SerializationError': {
            'name': 'SerializationError',
            'subtypes': [],
            'props': {
                'hash': ''
            }
        },
        'StackHeightInstrumentation': {
            'name': 'StackHeightInstrumentation',
            'subtypes': [],
            'props': {}
        },
        'StackOverflow': {
            'name': 'StackOverflow',
            'subtypes': [],
            'props': {}
        },
        'TotalLogLengthExceeded': {
            'name': 'TotalLogLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'Unreachable': {
            'name': 'Unreachable',
            'subtypes': [],
            'props': {}
        },
        'ValueLengthExceeded': {
            'name': 'ValueLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'WasmTrap': {
            'name': 'WasmTrap',
            'subtypes': [
                'Unreachable',
                'IncorrectCallIndirectSignature',
                'MemoryOutOfBounds',
                'CallIndirectOOB',
                'IllegalArithmetic',
                'MisalignedAtomicAccess',
                'BreakpointTrap',
                'StackOverflow',
                'GenericTrap'
            ],
            'props': {}
        },
        'WasmUnknownError': {
            'name': 'WasmUnknownError',
            'subtypes': [],
            'props': {}
        },
        'WasmerCompileError': {
            'name': 'WasmerCompileError',
            'subtypes': [],
            'props': {
                'msg': ''
            }
        },
        'WriteError': {
            'name': 'WriteError',
            'subtypes': [],
            'props': {}
        },
        'AccessKeyNotFound': {
            'name': 'AccessKeyNotFound',
            'subtypes': [],
            'props': {
                'account_id': '',
                'public_key': ''
            }
        },
        'AccountAlreadyExists': {
            'name': 'AccountAlreadyExists',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'AccountDoesNotExist': {
            'name': 'AccountDoesNotExist',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'ActionError': {
            'name': 'ActionError',
            'subtypes': [
                'AccountAlreadyExists',
                'AccountDoesNotExist',
                'CreateAccountOnlyByRegistrar',
                'CreateAccountNotAllowed',
                'ActorNoPermission',
                'DeleteKeyDoesNotExist',
                'AddKeyAlreadyExists',
                'DeleteAccountStaking',
                'LackBalanceForState',
                'TriesToUnstake',
                'TriesToStake',
                'InsufficientStake',
                'FunctionCallError',
                'NewReceiptValidationError',
                'OnlyImplicitAccountCreationAllowed'
            ],
            'props': {
                'index': ''
            }
        },
        'ActionsValidationError': {
            'name': 'ActionsValidationError',
            'subtypes': [
                'DeleteActionMustBeFinal',
                'TotalPrepaidGasExceeded',
                'TotalNumberOfActionsExceeded',
                'AddKeyMethodNamesNumberOfBytesExceeded',
                'AddKeyMethodNameLengthExceeded',
                'IntegerOverflow',
                'InvalidAccountId',
                'ContractSizeExceeded',
                'FunctionCallMethodNameLengthExceeded',
                'FunctionCallArgumentsLengthExceeded',
                'UnsuitableStakingKey',
                'FunctionCallZeroAttachedGas'
            ],
            'props': {}
        },
        'ActorNoPermission': {
            'name': 'ActorNoPermission',
            'subtypes': [],
            'props': {
                'account_id': '',
                'actor_id': ''
            }
        },
        'AddKeyAlreadyExists': {
            'name': 'AddKeyAlreadyExists',
            'subtypes': [],
            'props': {
                'account_id': '',
                'public_key': ''
            }
        },
        'AddKeyMethodNameLengthExceeded': {
            'name': 'AddKeyMethodNameLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'AddKeyMethodNamesNumberOfBytesExceeded': {
            'name': 'AddKeyMethodNamesNumberOfBytesExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'total_number_of_bytes': ''
            }
        },
        'BalanceMismatchError': {
            'name': 'BalanceMismatchError',
            'subtypes': [],
            'props': {
                'final_accounts_balance': '',
                'final_postponed_receipts_balance': '',
                'incoming_receipts_balance': '',
                'incoming_validator_rewards': '',
                'initial_accounts_balance': '',
                'initial_postponed_receipts_balance': '',
                'new_delayed_receipts_balance': '',
                'other_burnt_amount': '',
                'outgoing_receipts_balance': '',
                'processed_delayed_receipts_balance': '',
                'slashed_burnt_amount': '',
                'tx_burnt_amount': ''
            }
        },
        'CostOverflow': {
            'name': 'CostOverflow',
            'subtypes': [],
            'props': {}
        },
        'CreateAccountNotAllowed': {
            'name': 'CreateAccountNotAllowed',
            'subtypes': [],
            'props': {
                'account_id': '',
                'predecessor_id': ''
            }
        },
        'CreateAccountOnlyByRegistrar': {
            'name': 'CreateAccountOnlyByRegistrar',
            'subtypes': [],
            'props': {
                'account_id': '',
                'predecessor_id': '',
                'registrar_account_id': ''
            }
        },
        'DeleteAccountStaking': {
            'name': 'DeleteAccountStaking',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'DeleteActionMustBeFinal': {
            'name': 'DeleteActionMustBeFinal',
            'subtypes': [],
            'props': {}
        },
        'DeleteKeyDoesNotExist': {
            'name': 'DeleteKeyDoesNotExist',
            'subtypes': [],
            'props': {
                'account_id': '',
                'public_key': ''
            }
        },
        'DepositWithFunctionCall': {
            'name': 'DepositWithFunctionCall',
            'subtypes': [],
            'props': {}
        },
        'Expired': {
            'name': 'Expired',
            'subtypes': [],
            'props': {}
        },
        'FunctionCallArgumentsLengthExceeded': {
            'name': 'FunctionCallArgumentsLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'FunctionCallMethodNameLengthExceeded': {
            'name': 'FunctionCallMethodNameLengthExceeded',
            'subtypes': [],
            'props': {
                'length': '',
                'limit': ''
            }
        },
        'FunctionCallZeroAttachedGas': {
            'name': 'FunctionCallZeroAttachedGas',
            'subtypes': [],
            'props': {}
        },
        'InsufficientStake': {
            'name': 'InsufficientStake',
            'subtypes': [],
            'props': {
                'account_id': '',
                'minimum_stake': '',
                'stake': ''
            }
        },
        'InvalidAccessKeyError': {
            'name': 'InvalidAccessKeyError',
            'subtypes': [
                'AccessKeyNotFound',
                'ReceiverMismatch',
                'MethodNameMismatch',
                'RequiresFullAccess',
                'NotEnoughAllowance',
                'DepositWithFunctionCall'
            ],
            'props': {}
        },
        'InvalidChain': {
            'name': 'InvalidChain',
            'subtypes': [],
            'props': {}
        },
        'InvalidDataReceiverId': {
            'name': 'InvalidDataReceiverId',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'InvalidNonce': {
            'name': 'InvalidNonce',
            'subtypes': [],
            'props': {
                'ak_nonce': '',
                'tx_nonce': ''
            }
        },
        'InvalidPredecessorId': {
            'name': 'InvalidPredecessorId',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'InvalidReceiverId': {
            'name': 'InvalidReceiverId',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'InvalidSignature': {
            'name': 'InvalidSignature',
            'subtypes': [],
            'props': {}
        },
        'InvalidSignerId': {
            'name': 'InvalidSignerId',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'InvalidTxError': {
            'name': 'InvalidTxError',
            'subtypes': [
                'InvalidAccessKeyError',
                'InvalidSignerId',
                'SignerDoesNotExist',
                'InvalidNonce',
                'InvalidReceiverId',
                'InvalidSignature',
                'NotEnoughBalance',
                'LackBalanceForState',
                'CostOverflow',
                'InvalidChain',
                'Expired',
                'ActionsValidation'
            ],
            'props': {}
        },
        'LackBalanceForState': {
            'name': 'LackBalanceForState',
            'subtypes': [],
            'props': {
                'account_id': '',
                'amount': ''
            }
        },
        'MethodNameMismatch': {
            'name': 'MethodNameMismatch',
            'subtypes': [],
            'props': {
                'method_name': ''
            }
        },
        'NotEnoughAllowance': {
            'name': 'NotEnoughAllowance',
            'subtypes': [],
            'props': {
                'account_id': '',
                'allowance': '',
                'cost': '',
                'public_key': ''
            }
        },
        'NotEnoughBalance': {
            'name': 'NotEnoughBalance',
            'subtypes': [],
            'props': {
                'balance': '',
                'cost': '',
                'signer_id': ''
            }
        },
        'OnlyImplicitAccountCreationAllowed': {
            'name': 'OnlyImplicitAccountCreationAllowed',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'ReceiptValidationError': {
            'name': 'ReceiptValidationError',
            'subtypes': [
                'InvalidPredecessorId',
                'InvalidReceiverId',
                'InvalidSignerId',
                'InvalidDataReceiverId',
                'ReturnedValueLengthExceeded',
                'NumberInputDataDependenciesExceeded',
                'ActionsValidation'
            ],
            'props': {}
        },
        'ReceiverMismatch': {
            'name': 'ReceiverMismatch',
            'subtypes': [],
            'props': {
                'ak_receiver': '',
                'tx_receiver': ''
            }
        },
        'RequiresFullAccess': {
            'name': 'RequiresFullAccess',
            'subtypes': [],
            'props': {}
        },
        'SignerDoesNotExist': {
            'name': 'SignerDoesNotExist',
            'subtypes': [],
            'props': {
                'signer_id': ''
            }
        },
        'TotalNumberOfActionsExceeded': {
            'name': 'TotalNumberOfActionsExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'total_number_of_actions': ''
            }
        },
        'TotalPrepaidGasExceeded': {
            'name': 'TotalPrepaidGasExceeded',
            'subtypes': [],
            'props': {
                'limit': '',
                'total_prepaid_gas': ''
            }
        },
        'TriesToStake': {
            'name': 'TriesToStake',
            'subtypes': [],
            'props': {
                'account_id': '',
                'balance': '',
                'locked': '',
                'stake': ''
            }
        },
        'TriesToUnstake': {
            'name': 'TriesToUnstake',
            'subtypes': [],
            'props': {
                'account_id': ''
            }
        },
        'TxExecutionError': {
            'name': 'TxExecutionError',
            'subtypes': [
                'ActionError',
                'InvalidTxError'
            ],
            'props': {}
        },
        'UnsuitableStakingKey': {
            'name': 'UnsuitableStakingKey',
            'subtypes': [],
            'props': {
                'public_key': ''
            }
        },
        'Closed': {
            'name': 'Closed',
            'subtypes': [],
            'props': {}
        },
        'InternalError': {
            'name': 'InternalError',
            'subtypes': [],
            'props': {}
        },
        'ServerError': {
            'name': 'ServerError',
            'subtypes': [
                'TxExecutionError',
                'Timeout',
                'Closed',
                'InternalError'
            ],
            'props': {}
        },
        'Timeout': {
            'name': 'Timeout',
            'subtypes': [],
            'props': {}
        }
    }
};