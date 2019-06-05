// package: 
// file: access_key.proto

import * as jspb from "google-protobuf";
import * as wrappers_pb from "./wrappers_pb";
import * as uint128_pb from "./uint128_pb";

export class AccessKey extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): uint128_pb.Uint128 | undefined;
  setAmount(value?: uint128_pb.Uint128): void;

  hasBalanceOwner(): boolean;
  clearBalanceOwner(): void;
  getBalanceOwner(): wrappers_pb.StringValue | undefined;
  setBalanceOwner(value?: wrappers_pb.StringValue): void;

  hasContractId(): boolean;
  clearContractId(): void;
  getContractId(): wrappers_pb.StringValue | undefined;
  setContractId(value?: wrappers_pb.StringValue): void;

  hasMethodName(): boolean;
  clearMethodName(): void;
  getMethodName(): wrappers_pb.BytesValue | undefined;
  setMethodName(value?: wrappers_pb.BytesValue): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccessKey.AsObject;
  static toObject(includeInstance: boolean, msg: AccessKey): AccessKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccessKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccessKey;
  static deserializeBinaryFromReader(message: AccessKey, reader: jspb.BinaryReader): AccessKey;
}

export namespace AccessKey {
  export type AsObject = {
    amount?: uint128_pb.Uint128.AsObject,
    balanceOwner?: wrappers_pb.StringValue.AsObject,
    contractId?: wrappers_pb.StringValue.AsObject,
    methodName?: wrappers_pb.BytesValue.AsObject,
  }
}

