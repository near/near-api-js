import { Uint128, SendMoneyTransaction, CreateAccountTransaction, 
    SignedTransaction, DeployContractTransaction, FunctionCallTransaction, 
    StakeTransaction, SwapKeyTransaction, AddKeyTransaction,
    DeleteKeyTransaction, 
    google} from './protos';
import { base_decode } from './utils/serialize';
import { Signature } from './utils/key_pair';

const TRANSACTION_FIELD_MAP = {
    [CreateAccountTransaction.name]: 'createAccount',
    [DeployContractTransaction.name]: 'deployContract',
    [FunctionCallTransaction.name]: 'functionCall',
    [SendMoneyTransaction.name]: 'sendMoney',
    [StakeTransaction.name]: 'stake',
    [SwapKeyTransaction.name]: 'swapKey',
    [AddKeyTransaction.name]: 'addKey',
    [DeleteKeyTransaction.name]: 'deleteKey',
};

function bigInt(num: bigint): Uint128 {
    return new Uint128({ number: Buffer.from(num.toString(16), 'hex')});
}

export function sendMoney(nonce: number, originator: string, receiver: string, amount: bigint): SendMoneyTransaction {
    return new SendMoneyTransaction({nonce, originator, receiver, amount: bigInt(amount)})
}

export function createAccount(nonce: number, originator: string, newAccountId: string, publicKey: string, amount: bigint): CreateAccountTransaction {
    return new CreateAccountTransaction({nonce, originator, newAccountId, publicKey: base_decode(publicKey), amount: bigInt(amount)});
}

export function signedTransaction(transaction: SendMoneyTransaction | CreateAccountTransaction, signature: Signature): SignedTransaction {
    const fieldName = TRANSACTION_FIELD_MAP[transaction.constructor.name];
    return new SignedTransaction({
        signature: signature.signature,
        publicKey: google.protobuf.BytesValue.create({ value: base_decode(signature.publicKey) }),
        [fieldName]: transaction,
    });
}
