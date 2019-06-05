// package: 
// file: signed_transaction.proto

import * as jspb from "google-protobuf";
import * as wrappers_pb from "./wrappers_pb";
import * as access_key_pb from "./access_key_pb";
import * as uint128_pb from "./uint128_pb";

export class CreateAccountTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getNewAccountId(): string;
  setNewAccountId(value: string): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): uint128_pb.Uint128 | undefined;
  setAmount(value?: uint128_pb.Uint128): void;

  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountTransaction): CreateAccountTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAccountTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountTransaction;
  static deserializeBinaryFromReader(message: CreateAccountTransaction, reader: jspb.BinaryReader): CreateAccountTransaction;
}

export namespace CreateAccountTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    newAccountId: string,
    amount?: uint128_pb.Uint128.AsObject,
    publicKey: Uint8Array | string,
  }
}

export class DeployContractTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getContractId(): string;
  setContractId(value: string): void;

  getWasmByteArray(): Uint8Array | string;
  getWasmByteArray_asU8(): Uint8Array;
  getWasmByteArray_asB64(): string;
  setWasmByteArray(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployContractTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: DeployContractTransaction): DeployContractTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployContractTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployContractTransaction;
  static deserializeBinaryFromReader(message: DeployContractTransaction, reader: jspb.BinaryReader): DeployContractTransaction;
}

export namespace DeployContractTransaction {
  export type AsObject = {
    nonce: number,
    contractId: string,
    wasmByteArray: Uint8Array | string,
  }
}

export class FunctionCallTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getContractId(): string;
  setContractId(value: string): void;

  getMethodName(): Uint8Array | string;
  getMethodName_asU8(): Uint8Array;
  getMethodName_asB64(): string;
  setMethodName(value: Uint8Array | string): void;

  getArgs(): Uint8Array | string;
  getArgs_asU8(): Uint8Array;
  getArgs_asB64(): string;
  setArgs(value: Uint8Array | string): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): uint128_pb.Uint128 | undefined;
  setAmount(value?: uint128_pb.Uint128): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FunctionCallTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: FunctionCallTransaction): FunctionCallTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FunctionCallTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FunctionCallTransaction;
  static deserializeBinaryFromReader(message: FunctionCallTransaction, reader: jspb.BinaryReader): FunctionCallTransaction;
}

export namespace FunctionCallTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    contractId: string,
    methodName: Uint8Array | string,
    args: Uint8Array | string,
    amount?: uint128_pb.Uint128.AsObject,
  }
}

export class SendMoneyTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getReceiver(): string;
  setReceiver(value: string): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): uint128_pb.Uint128 | undefined;
  setAmount(value?: uint128_pb.Uint128): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendMoneyTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: SendMoneyTransaction): SendMoneyTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendMoneyTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendMoneyTransaction;
  static deserializeBinaryFromReader(message: SendMoneyTransaction, reader: jspb.BinaryReader): SendMoneyTransaction;
}

export namespace SendMoneyTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    receiver: string,
    amount?: uint128_pb.Uint128.AsObject,
  }
}

export class StakeTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): uint128_pb.Uint128 | undefined;
  setAmount(value?: uint128_pb.Uint128): void;

  getPublicKey(): string;
  setPublicKey(value: string): void;

  getBlsPublicKey(): string;
  setBlsPublicKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakeTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: StakeTransaction): StakeTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StakeTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakeTransaction;
  static deserializeBinaryFromReader(message: StakeTransaction, reader: jspb.BinaryReader): StakeTransaction;
}

export namespace StakeTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    amount?: uint128_pb.Uint128.AsObject,
    publicKey: string,
    blsPublicKey: string,
  }
}

export class SwapKeyTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getCurKey(): Uint8Array | string;
  getCurKey_asU8(): Uint8Array;
  getCurKey_asB64(): string;
  setCurKey(value: Uint8Array | string): void;

  getNewKey(): Uint8Array | string;
  getNewKey_asU8(): Uint8Array;
  getNewKey_asB64(): string;
  setNewKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SwapKeyTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: SwapKeyTransaction): SwapKeyTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SwapKeyTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SwapKeyTransaction;
  static deserializeBinaryFromReader(message: SwapKeyTransaction, reader: jspb.BinaryReader): SwapKeyTransaction;
}

export namespace SwapKeyTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    curKey: Uint8Array | string,
    newKey: Uint8Array | string,
  }
}

export class AddKeyTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getNewKey(): Uint8Array | string;
  getNewKey_asU8(): Uint8Array;
  getNewKey_asB64(): string;
  setNewKey(value: Uint8Array | string): void;

  hasAccessKey(): boolean;
  clearAccessKey(): void;
  getAccessKey(): access_key_pb.AccessKey | undefined;
  setAccessKey(value?: access_key_pb.AccessKey): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddKeyTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: AddKeyTransaction): AddKeyTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddKeyTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddKeyTransaction;
  static deserializeBinaryFromReader(message: AddKeyTransaction, reader: jspb.BinaryReader): AddKeyTransaction;
}

export namespace AddKeyTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    newKey: Uint8Array | string,
    accessKey?: access_key_pb.AccessKey.AsObject,
  }
}

export class DeleteKeyTransaction extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): void;

  getOriginator(): string;
  setOriginator(value: string): void;

  getCurKey(): Uint8Array | string;
  getCurKey_asU8(): Uint8Array;
  getCurKey_asB64(): string;
  setCurKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteKeyTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteKeyTransaction): DeleteKeyTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteKeyTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteKeyTransaction;
  static deserializeBinaryFromReader(message: DeleteKeyTransaction, reader: jspb.BinaryReader): DeleteKeyTransaction;
}

export namespace DeleteKeyTransaction {
  export type AsObject = {
    nonce: number,
    originator: string,
    curKey: Uint8Array | string,
  }
}

export class SignedTransaction extends jspb.Message {
  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): wrappers_pb.BytesValue | undefined;
  setPublicKey(value?: wrappers_pb.BytesValue): void;

  hasCreateAccount(): boolean;
  clearCreateAccount(): void;
  getCreateAccount(): CreateAccountTransaction | undefined;
  setCreateAccount(value?: CreateAccountTransaction): void;

  hasDeployContract(): boolean;
  clearDeployContract(): void;
  getDeployContract(): DeployContractTransaction | undefined;
  setDeployContract(value?: DeployContractTransaction): void;

  hasFunctionCall(): boolean;
  clearFunctionCall(): void;
  getFunctionCall(): FunctionCallTransaction | undefined;
  setFunctionCall(value?: FunctionCallTransaction): void;

  hasSendMoney(): boolean;
  clearSendMoney(): void;
  getSendMoney(): SendMoneyTransaction | undefined;
  setSendMoney(value?: SendMoneyTransaction): void;

  hasStake(): boolean;
  clearStake(): void;
  getStake(): StakeTransaction | undefined;
  setStake(value?: StakeTransaction): void;

  hasSwapKey(): boolean;
  clearSwapKey(): void;
  getSwapKey(): SwapKeyTransaction | undefined;
  setSwapKey(value?: SwapKeyTransaction): void;

  hasAddKey(): boolean;
  clearAddKey(): void;
  getAddKey(): AddKeyTransaction | undefined;
  setAddKey(value?: AddKeyTransaction): void;

  hasDeleteKey(): boolean;
  clearDeleteKey(): void;
  getDeleteKey(): DeleteKeyTransaction | undefined;
  setDeleteKey(value?: DeleteKeyTransaction): void;

  getBodyCase(): SignedTransaction.BodyCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignedTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: SignedTransaction): SignedTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignedTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignedTransaction;
  static deserializeBinaryFromReader(message: SignedTransaction, reader: jspb.BinaryReader): SignedTransaction;
}

export namespace SignedTransaction {
  export type AsObject = {
    signature: Uint8Array | string,
    publicKey?: wrappers_pb.BytesValue.AsObject,
    createAccount?: CreateAccountTransaction.AsObject,
    deployContract?: DeployContractTransaction.AsObject,
    functionCall?: FunctionCallTransaction.AsObject,
    sendMoney?: SendMoneyTransaction.AsObject,
    stake?: StakeTransaction.AsObject,
    swapKey?: SwapKeyTransaction.AsObject,
    addKey?: AddKeyTransaction.AsObject,
    deleteKey?: DeleteKeyTransaction.AsObject,
  }

  export enum BodyCase {
    BODY_NOT_SET = 0,
    CREATE_ACCOUNT = 2,
    DEPLOY_CONTRACT = 3,
    FUNCTION_CALL = 4,
    SEND_MONEY = 5,
    STAKE = 6,
    SWAP_KEY = 7,
    ADD_KEY = 8,
    DELETE_KEY = 9,
  }
}

