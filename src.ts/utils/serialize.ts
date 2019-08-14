'use strict';

import bs58 from 'bs58';
import BN from 'bn.js';

export function base_encode(value: Uint8Array | string): string {
    if (typeof(value) === 'string') {
        value = Buffer.from(value, 'utf8');
    }
    return bs58.encode(Buffer.from(value));
}

export function base_decode(value: string): Uint8Array {
    return bs58.decode(value);
}

const INITIAL_LENGTH = 1024;

/// Binary encoder.
export class BinaryWriter {
    buf: Buffer;
    length: number;

    public constructor() {
        this.buf = Buffer.alloc(INITIAL_LENGTH);
        this.length = 0;
    }

    resize() {
        this.buf = Buffer.concat([this.buf, Buffer.alloc(INITIAL_LENGTH)]);
    }

    public write_u8(value: number) {
        this.buf.writeInt8(value, this.length);
        this.length += 1;
    }

    public write_u32(value: number) {
        this.buf.writeUInt32LE(value, this.length);
        this.length += 4;
    }

    public write_u64(value: BN) {
        this.write_buffer(Buffer.from(new BN(value).toArray('le', 8)));
    }

    public write_u128(value: BN) {
        this.write_buffer(Buffer.from(new BN(value).toArray('le', 16)));
    }

    private write_buffer(buffer: Buffer) {
        this.buf = Buffer.concat([this.buf.subarray(0, this.length), buffer, Buffer.alloc(INITIAL_LENGTH)])
        this.length += buffer.length;
    }

    public write_string(str: string) {
        let b = Buffer.from(str, 'utf8');
        this.write_u32(b.length);
        this.write_buffer(b);
    }

    public write_fixed_array(array: Uint8Array) {
        this.write_buffer(Buffer.from(array));
    }

    public write_array(array: Array<any>, fn: any) {
        this.write_u32(array.length);
        for (let i = 0; i < array.length; ++i) {
            fn(array[i]);
        }
    }

    public toArray(): Uint8Array {
        return this.buf.subarray(0, this.length);
    }
}

export class BinaryReader {
    buf: Buffer;
    offset: number;

    public constructor(buf: Buffer) {
        this.buf = buf;
        this.offset = 0;
    }

    read_u8(): number {
        const value = this.buf.readInt8(this.offset);
        this.offset += 1;
        return value;
    }

    read_u32(): number {
        const value = this.buf.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    read_u64(): BN {
        let buf = this.read_buffer(8);
        buf.reverse();
        return new BN(`${buf.toString('hex')}`, 16);
    }

    read_u128(): BN {
        let buf = this.read_buffer(16);
        return new BN(buf);
    }

    private read_buffer(len: number): Buffer {
        const result = this.buf.slice(this.offset, this.offset + len);
        this.offset += len;
        return result;
    }

    read_string(): string {
        let len = this.read_u32();
        return this.read_buffer(len).toString('utf8');
    }

    read_fixed_array(len: number): Uint8Array {
        return new Uint8Array(this.read_buffer(len));
    }

    read_array(fn: any): Array<any> {
        const len = this.read_u32();
        let result = Array<any>();
        for (let i = 0; i < len; ++i) {
            result.push(fn());
        }
        return result;
    }
}

function serializeField(schema: any, value: any, fieldType: any, writer: any) {
    if (typeof fieldType === "string") {
        writer[`write_${fieldType}`](value);
    } else if (fieldType instanceof Array) {
        if (typeof fieldType[0] === "number") {
            writer.write_fixed_array(value);
        } else {
            writer.write_array(value, (item: any) => { serializeField(schema, item, fieldType[0], writer) });
        }
    } else {
        serializeStruct(schema, value, writer);
    }
}

function serializeStruct(schema: any, obj: any, writer: any) {
    const className = obj.constructor.name;
    schema[className].map(([fieldName, fieldType]: [any, any]) => {
        serializeField(schema, obj[fieldName], fieldType, writer);
    });
}

/// Serialize given object using schema of the form:
/// { class_name -> [ [field_name, field_type], .. ], .. }
export function serialize(schema: any, obj: any): Uint8Array {
    let writer = new BinaryWriter();
    serializeStruct(schema, obj, writer);
    return writer.toArray();
}

function deserializeField(schema: any, fieldType: any, reader: any): any {
    if (typeof fieldType === "string") {
        return reader[`read_${fieldType}`]();
    } else if (fieldType instanceof Array) {
        if (typeof fieldType[0] === 'number') {
            return reader.read_fixed_array(fieldType[0]);
        } else {
            return reader.read_array(() => { return deserializeField(schema, fieldType[0], reader) });
        }
    } else {
        return deserializeStruct(schema, fieldType, reader);
    }
}

function deserializeStruct(schema: any, classType: any, reader: any) {
    console.log(classType.name);
    let fields = schema[classType.name].map(([fieldName, fieldType]: [any, any]) => {
        return deserializeField(schema, fieldType, reader);
    });
    return new classType(...fields);
}

/// Deserializes object from bytes using schema.
export function deserialize(schema: any, classType: any, buffer: Buffer): any {
    let reader = new BinaryReader(buffer);
    return deserializeStruct(schema, classType, reader);
}