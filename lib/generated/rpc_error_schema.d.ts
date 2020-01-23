export declare namespace schema {
    export namespace InvalidIteratorIndex {
        export const name: string;
        export const subtypes: any[];
        export namespace props {
            export const iterator_index: string;
        }
    }
    export namespace InvalidPublicKey {
        const name_1: string;
        export { name_1 as name };
        const subtypes_1: any[];
        export { subtypes_1 as subtypes };
        const props_1: {};
        export { props_1 as props };
    }
    export namespace CannotAppendActionToJointPromise {
        const name_2: string;
        export { name_2 as name };
        const subtypes_2: any[];
        export { subtypes_2 as subtypes };
        const props_2: {};
        export { props_2 as props };
    }
    export namespace Instantiate {
        const name_3: string;
        export { name_3 as name };
        const subtypes_3: any[];
        export { subtypes_3 as subtypes };
        const props_3: {};
        export { props_3 as props };
    }
    export namespace MemoryAccessViolation {
        const name_4: string;
        export { name_4 as name };
        const subtypes_4: any[];
        export { subtypes_4 as subtypes };
        const props_4: {};
        export { props_4 as props };
    }
    export namespace BadUTF16 {
        const name_5: string;
        export { name_5 as name };
        const subtypes_5: any[];
        export { subtypes_5 as subtypes };
        const props_5: {};
        export { props_5 as props };
    }
    export namespace LinkError {
        const name_6: string;
        export { name_6 as name };
        const subtypes_6: any[];
        export { subtypes_6 as subtypes };
        export namespace props_6 {
            export const msg: string;
        }
        export { props_6 as props };
    }
    export namespace StackHeightInstrumentation {
        const name_7: string;
        export { name_7 as name };
        const subtypes_7: any[];
        export { subtypes_7 as subtypes };
        const props_7: {};
        export { props_7 as props };
    }
    export namespace WasmerCompileError {
        const name_8: string;
        export { name_8 as name };
        const subtypes_8: any[];
        export { subtypes_8 as subtypes };
        export namespace props_8 {
            const msg_1: string;
            export { msg_1 as msg };
        }
        export { props_8 as props };
    }
    export namespace Memory {
        const name_9: string;
        export { name_9 as name };
        const subtypes_9: any[];
        export { subtypes_9 as subtypes };
        const props_9: {};
        export { props_9 as props };
    }
    export namespace InvalidAccountId {
        const name_10: string;
        export { name_10 as name };
        const subtypes_10: any[];
        export { subtypes_10 as subtypes };
        const props_10: {};
        export { props_10 as props };
    }
    export namespace ResolveError {
        const name_11: string;
        export { name_11 as name };
        const subtypes_11: string[];
        export { subtypes_11 as subtypes };
        const props_11: {};
        export { props_11 as props };
    }
    export namespace InternalMemoryDeclared {
        const name_12: string;
        export { name_12 as name };
        const subtypes_12: any[];
        export { subtypes_12 as subtypes };
        const props_12: {};
        export { props_12 as props };
    }
    export namespace GasInstrumentation {
        const name_13: string;
        export { name_13 as name };
        const subtypes_13: any[];
        export { subtypes_13 as subtypes };
        const props_13: {};
        export { props_13 as props };
    }
    export namespace MethodUTF8Error {
        const name_14: string;
        export { name_14 as name };
        const subtypes_14: any[];
        export { subtypes_14 as subtypes };
        const props_14: {};
        export { props_14 as props };
    }
    export namespace PrepareError {
        const name_15: string;
        export { name_15 as name };
        const subtypes_15: string[];
        export { subtypes_15 as subtypes };
        const props_15: {};
        export { props_15 as props };
    }
    export namespace CannotReturnJointPromise {
        const name_16: string;
        export { name_16 as name };
        const subtypes_16: any[];
        export { subtypes_16 as subtypes };
        const props_16: {};
        export { props_16 as props };
    }
    export namespace MethodInvalidSignature {
        const name_17: string;
        export { name_17 as name };
        const subtypes_17: any[];
        export { subtypes_17 as subtypes };
        const props_17: {};
        export { props_17 as props };
    }
    export namespace InvalidRegisterId {
        const name_18: string;
        export { name_18 as name };
        const subtypes_18: any[];
        export { subtypes_18 as subtypes };
        export namespace props_18 {
            export const register_id: string;
        }
        export { props_18 as props };
    }
    export namespace GasExceeded {
        const name_19: string;
        export { name_19 as name };
        const subtypes_19: any[];
        export { subtypes_19 as subtypes };
        const props_19: {};
        export { props_19 as props };
    }
    export namespace FunctionCall {
        const name_20: string;
        export { name_20 as name };
        const subtypes_20: string[];
        export { subtypes_20 as subtypes };
        const props_20: {};
        export { props_20 as props };
    }
    export namespace Deserialization {
        const name_21: string;
        export { name_21 as name };
        const subtypes_21: any[];
        export { subtypes_21 as subtypes };
        const props_21: {};
        export { props_21 as props };
    }
    export namespace FunctionExecError {
        const name_22: string;
        export { name_22 as name };
        const subtypes_22: string[];
        export { subtypes_22 as subtypes };
        const props_22: {};
        export { props_22 as props };
    }
    export namespace GasLimitExceeded {
        const name_23: string;
        export { name_23 as name };
        const subtypes_23: any[];
        export { subtypes_23 as subtypes };
        const props_23: {};
        export { props_23 as props };
    }
    export namespace BalanceExceeded {
        const name_24: string;
        export { name_24 as name };
        const subtypes_24: any[];
        export { subtypes_24 as subtypes };
        const props_24: {};
        export { props_24 as props };
    }
    export namespace Serialization {
        const name_25: string;
        export { name_25 as name };
        const subtypes_25: any[];
        export { subtypes_25 as subtypes };
        const props_25: {};
        export { props_25 as props };
    }
    export namespace WasmTrap {
        const name_26: string;
        export { name_26 as name };
        const subtypes_26: any[];
        export { subtypes_26 as subtypes };
        export namespace props_26 {
            const msg_2: string;
            export { msg_2 as msg };
        }
        export { props_26 as props };
    }
    export namespace ProhibitedInView {
        const name_27: string;
        export { name_27 as name };
        const subtypes_27: any[];
        export { subtypes_27 as subtypes };
        export namespace props_27 {
            export const method_name: string;
        }
        export { props_27 as props };
    }
    export namespace MethodEmptyName {
        const name_28: string;
        export { name_28 as name };
        const subtypes_28: any[];
        export { subtypes_28 as subtypes };
        const props_28: {};
        export { props_28 as props };
    }
    export namespace EmptyMethodName {
        const name_29: string;
        export { name_29 as name };
        const subtypes_29: any[];
        export { subtypes_29 as subtypes };
        const props_29: {};
        export { props_29 as props };
    }
    export namespace GuestPanic {
        const name_30: string;
        export { name_30 as name };
        const subtypes_30: any[];
        export { subtypes_30 as subtypes };
        export namespace props_30 {
            export const panic_msg: string;
        }
        export { props_30 as props };
    }
    export namespace InvalidMethodName {
        const name_31: string;
        export { name_31 as name };
        const subtypes_31: any[];
        export { subtypes_31 as subtypes };
        const props_31: {};
        export { props_31 as props };
    }
    export namespace MethodNotFound {
        const name_32: string;
        export { name_32 as name };
        const subtypes_32: any[];
        export { subtypes_32 as subtypes };
        const props_32: {};
        export { props_32 as props };
    }
    export namespace InvalidPromiseResultIndex {
        const name_33: string;
        export { name_33 as name };
        const subtypes_33: any[];
        export { subtypes_33 as subtypes };
        export namespace props_33 {
            export const result_idx: string;
        }
        export { props_33 as props };
    }
    export namespace IteratorWasInvalidated {
        const name_34: string;
        export { name_34 as name };
        const subtypes_34: any[];
        export { subtypes_34 as subtypes };
        export namespace props_34 {
            const iterator_index_1: string;
            export { iterator_index_1 as iterator_index };
        }
        export { props_34 as props };
    }
    export namespace CompilationError {
        const name_35: string;
        export { name_35 as name };
        const subtypes_35: string[];
        export { subtypes_35 as subtypes };
        const props_35: {};
        export { props_35 as props };
    }
    export namespace InvalidPromiseIndex {
        const name_36: string;
        export { name_36 as name };
        const subtypes_36: any[];
        export { subtypes_36 as subtypes };
        export namespace props_36 {
            export const promise_idx: string;
        }
        export { props_36 as props };
    }
    export namespace BadUTF8 {
        const name_37: string;
        export { name_37 as name };
        const subtypes_37: any[];
        export { subtypes_37 as subtypes };
        const props_37: {};
        export { props_37 as props };
    }
    export namespace InvalidReceiptIndex {
        const name_38: string;
        export { name_38 as name };
        const subtypes_38: any[];
        export { subtypes_38 as subtypes };
        export namespace props_38 {
            export const receipt_index: string;
        }
        export { props_38 as props };
    }
    export namespace CodeDoesNotExist {
        const name_39: string;
        export { name_39 as name };
        const subtypes_39: any[];
        export { subtypes_39 as subtypes };
        export namespace props_39 {
            export const account_id: string;
        }
        export { props_39 as props };
    }
    export namespace HostError {
        const name_40: string;
        export { name_40 as name };
        const subtypes_40: string[];
        export { subtypes_40 as subtypes };
        const props_40: {};
        export { props_40 as props };
    }
    export namespace IntegerOverflow {
        const name_41: string;
        export { name_41 as name };
        const subtypes_41: any[];
        export { subtypes_41 as subtypes };
        const props_41: {};
        export { props_41 as props };
    }
    export namespace NotEnoughAllowance {
        const name_42: string;
        export { name_42 as name };
        const subtypes_42: any[];
        export { subtypes_42 as subtypes };
        export namespace props_42 {
            export const public_key: string;
            export const allowance: string;
            const account_id_1: string;
            export { account_id_1 as account_id };
            export const cost: string;
        }
        export { props_42 as props };
    }
    export namespace ReceiverMismatch {
        const name_43: string;
        export { name_43 as name };
        const subtypes_43: any[];
        export { subtypes_43 as subtypes };
        export namespace props_43 {
            export const ak_receiver: string;
            export const tx_receiver: string;
        }
        export { props_43 as props };
    }
    export namespace DeleteAccountStaking {
        const name_44: string;
        export { name_44 as name };
        const subtypes_44: any[];
        export { subtypes_44 as subtypes };
        export namespace props_44 {
            const account_id_2: string;
            export { account_id_2 as account_id };
        }
        export { props_44 as props };
    }
    export namespace TriesToStake {
        const name_45: string;
        export { name_45 as name };
        const subtypes_45: any[];
        export { subtypes_45 as subtypes };
        export namespace props_45 {
            export const balance: string;
            const account_id_3: string;
            export { account_id_3 as account_id };
            export const locked: string;
            export const stake: string;
        }
        export { props_45 as props };
    }
    export namespace InvalidReceiverId {
        const name_46: string;
        export { name_46 as name };
        const subtypes_46: any[];
        export { subtypes_46 as subtypes };
        export namespace props_46 {
            export const receiver_id: string;
        }
        export { props_46 as props };
    }
    export namespace AccessKeyNotFound {
        const name_47: string;
        export { name_47 as name };
        const subtypes_47: any[];
        export { subtypes_47 as subtypes };
        export namespace props_47 {
            const public_key_1: string;
            export { public_key_1 as public_key };
            const account_id_4: string;
            export { account_id_4 as account_id };
        }
        export { props_47 as props };
    }
    export namespace RentUnpaid {
        const name_48: string;
        export { name_48 as name };
        const subtypes_48: any[];
        export { subtypes_48 as subtypes };
        export namespace props_48 {
            export const amount: string;
            const account_id_5: string;
            export { account_id_5 as account_id };
        }
        export { props_48 as props };
    }
    export namespace Expired {
        const name_49: string;
        export { name_49 as name };
        const subtypes_49: any[];
        export { subtypes_49 as subtypes };
        const props_49: {};
        export { props_49 as props };
    }
    export namespace InvalidSignature {
        const name_50: string;
        export { name_50 as name };
        const subtypes_50: any[];
        export { subtypes_50 as subtypes };
        const props_50: {};
        export { props_50 as props };
    }
    export namespace InvalidChain {
        const name_51: string;
        export { name_51 as name };
        const subtypes_51: any[];
        export { subtypes_51 as subtypes };
        const props_51: {};
        export { props_51 as props };
    }
    export namespace MethodNameMismatch {
        const name_52: string;
        export { name_52 as name };
        const subtypes_52: any[];
        export { subtypes_52 as subtypes };
        export namespace props_52 {
            const method_name_1: string;
            export { method_name_1 as method_name };
        }
        export { props_52 as props };
    }
    export namespace InvalidTxError {
        const name_53: string;
        export { name_53 as name };
        const subtypes_53: string[];
        export { subtypes_53 as subtypes };
        const props_53: {};
        export { props_53 as props };
    }
    export namespace InvalidSignerId {
        const name_54: string;
        export { name_54 as name };
        const subtypes_54: any[];
        export { subtypes_54 as subtypes };
        export namespace props_54 {
            export const signer_id: string;
        }
        export { props_54 as props };
    }
    export namespace CostOverflow {
        const name_55: string;
        export { name_55 as name };
        const subtypes_55: any[];
        export { subtypes_55 as subtypes };
        const props_55: {};
        export { props_55 as props };
    }
    export namespace ActorNoPermission {
        const name_56: string;
        export { name_56 as name };
        const subtypes_56: any[];
        export { subtypes_56 as subtypes };
        export namespace props_56 {
            const account_id_6: string;
            export { account_id_6 as account_id };
            export const actor_id: string;
        }
        export { props_56 as props };
    }
    export namespace DeleteKeyDoesNotExist {
        const name_57: string;
        export { name_57 as name };
        const subtypes_57: any[];
        export { subtypes_57 as subtypes };
        export namespace props_57 {
            const account_id_7: string;
            export { account_id_7 as account_id };
            const public_key_2: string;
            export { public_key_2 as public_key };
        }
        export { props_57 as props };
    }
    export namespace AddKeyAlreadyExists {
        const name_58: string;
        export { name_58 as name };
        const subtypes_58: any[];
        export { subtypes_58 as subtypes };
        export namespace props_58 {
            const public_key_3: string;
            export { public_key_3 as public_key };
            const account_id_8: string;
            export { account_id_8 as account_id };
        }
        export { props_58 as props };
    }
    export namespace DeleteAccountHasRent {
        const name_59: string;
        export { name_59 as name };
        const subtypes_59: any[];
        export { subtypes_59 as subtypes };
        export namespace props_59 {
            const balance_1: string;
            export { balance_1 as balance };
            const account_id_9: string;
            export { account_id_9 as account_id };
        }
        export { props_59 as props };
    }
    export namespace TriesToUnstake {
        const name_60: string;
        export { name_60 as name };
        const subtypes_60: any[];
        export { subtypes_60 as subtypes };
        export namespace props_60 {
            const account_id_10: string;
            export { account_id_10 as account_id };
        }
        export { props_60 as props };
    }
    export namespace TxExecutionError {
        const name_61: string;
        export { name_61 as name };
        const subtypes_61: string[];
        export { subtypes_61 as subtypes };
        const props_61: {};
        export { props_61 as props };
    }
    export namespace AccountAlreadyExists {
        const name_62: string;
        export { name_62 as name };
        const subtypes_62: any[];
        export { subtypes_62 as subtypes };
        export namespace props_62 {
            const account_id_11: string;
            export { account_id_11 as account_id };
        }
        export { props_62 as props };
    }
    export namespace NotEnoughBalance {
        const name_63: string;
        export { name_63 as name };
        const subtypes_63: any[];
        export { subtypes_63 as subtypes };
        export namespace props_63 {
            const balance_2: string;
            export { balance_2 as balance };
            const signer_id_1: string;
            export { signer_id_1 as signer_id };
            const cost_1: string;
            export { cost_1 as cost };
        }
        export { props_63 as props };
    }
    export namespace InvalidAccessKey {
        const name_64: string;
        export { name_64 as name };
        const subtypes_64: string[];
        export { subtypes_64 as subtypes };
        const props_64: {};
        export { props_64 as props };
    }
    export namespace InvalidNonce {
        const name_65: string;
        export { name_65 as name };
        const subtypes_65: any[];
        export { subtypes_65 as subtypes };
        export namespace props_65 {
            export const ak_nonce: string;
            export const tx_nonce: string;
        }
        export { props_65 as props };
    }
    export namespace SignerDoesNotExist {
        const name_66: string;
        export { name_66 as name };
        const subtypes_66: any[];
        export { subtypes_66 as subtypes };
        export namespace props_66 {
            const signer_id_2: string;
            export { signer_id_2 as signer_id };
        }
        export { props_66 as props };
    }
    export namespace ActionError {
        const name_67: string;
        export { name_67 as name };
        const subtypes_67: string[];
        export { subtypes_67 as subtypes };
        export namespace props_67 {
            export const index: string;
        }
        export { props_67 as props };
    }
    export namespace AccountDoesNotExist {
        const name_68: string;
        export { name_68 as name };
        const subtypes_68: any[];
        export { subtypes_68 as subtypes };
        export namespace props_68 {
            const account_id_12: string;
            export { account_id_12 as account_id };
        }
        export { props_68 as props };
    }
    export namespace CreateAccountNotAllowed {
        const name_69: string;
        export { name_69 as name };
        const subtypes_69: any[];
        export { subtypes_69 as subtypes };
        export namespace props_69 {
            export const predecessor_id: string;
            const account_id_13: string;
            export { account_id_13 as account_id };
        }
        export { props_69 as props };
    }
    export namespace Closed {
        const name_70: string;
        export { name_70 as name };
        const subtypes_70: any[];
        export { subtypes_70 as subtypes };
        const props_70: {};
        export { props_70 as props };
    }
    export namespace Timeout {
        const name_71: string;
        export { name_71 as name };
        const subtypes_71: any[];
        export { subtypes_71 as subtypes };
        const props_71: {};
        export { props_71 as props };
    }
    export namespace ServerError {
        const name_72: string;
        export { name_72 as name };
        const subtypes_72: string[];
        export { subtypes_72 as subtypes };
        const props_72: {};
        export { props_72 as props };
    }
}
