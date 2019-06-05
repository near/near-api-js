// package: 
// file: uint128.proto

import * as jspb from "google-protobuf";

export class Uint128 extends jspb.Message {
  getNumber(): Uint8Array | string;
  getNumber_asU8(): Uint8Array;
  getNumber_asB64(): string;
  setNumber(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Uint128.AsObject;
  static toObject(includeInstance: boolean, msg: Uint128): Uint128.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Uint128, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Uint128;
  static deserializeBinaryFromReader(message: Uint128, reader: jspb.BinaryReader): Uint128;
}

export namespace Uint128 {
  export type AsObject = {
    number: Uint8Array | string,
  }
}

