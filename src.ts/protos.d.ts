import * as $protobuf from "protobufjs";
/** Properties of a CreateAccountTransaction. */
export interface ICreateAccountTransaction {

    /** CreateAccountTransaction nonce */
    nonce?: (number|Long|null);

    /** CreateAccountTransaction originator */
    originator?: (string|null);

    /** CreateAccountTransaction newAccountId */
    newAccountId?: (string|null);

    /** CreateAccountTransaction amount */
    amount?: (IUint128|null);

    /** CreateAccountTransaction publicKey */
    publicKey?: (Uint8Array|null);
}

/** Represents a CreateAccountTransaction. */
export class CreateAccountTransaction implements ICreateAccountTransaction {

    /**
     * Constructs a new CreateAccountTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateAccountTransaction);

    /** CreateAccountTransaction nonce. */
    public nonce: (number|Long);

    /** CreateAccountTransaction originator. */
    public originator: string;

    /** CreateAccountTransaction newAccountId. */
    public newAccountId: string;

    /** CreateAccountTransaction amount. */
    public amount?: (IUint128|null);

    /** CreateAccountTransaction publicKey. */
    public publicKey: Uint8Array;

    /**
     * Creates a new CreateAccountTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateAccountTransaction instance
     */
    public static create(properties?: ICreateAccountTransaction): CreateAccountTransaction;

    /**
     * Encodes the specified CreateAccountTransaction message. Does not implicitly {@link CreateAccountTransaction.verify|verify} messages.
     * @param message CreateAccountTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICreateAccountTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CreateAccountTransaction message, length delimited. Does not implicitly {@link CreateAccountTransaction.verify|verify} messages.
     * @param message CreateAccountTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICreateAccountTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CreateAccountTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateAccountTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateAccountTransaction;

    /**
     * Decodes a CreateAccountTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateAccountTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateAccountTransaction;

    /**
     * Verifies a CreateAccountTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CreateAccountTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateAccountTransaction
     */
    public static fromObject(object: { [k: string]: any }): CreateAccountTransaction;

    /**
     * Creates a plain object from a CreateAccountTransaction message. Also converts values to other types if specified.
     * @param message CreateAccountTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CreateAccountTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CreateAccountTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DeployContractTransaction. */
export interface IDeployContractTransaction {

    /** DeployContractTransaction nonce */
    nonce?: (number|Long|null);

    /** DeployContractTransaction contractId */
    contractId?: (string|null);

    /** DeployContractTransaction wasmByteArray */
    wasmByteArray?: (Uint8Array|null);
}

/** Represents a DeployContractTransaction. */
export class DeployContractTransaction implements IDeployContractTransaction {

    /**
     * Constructs a new DeployContractTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDeployContractTransaction);

    /** DeployContractTransaction nonce. */
    public nonce: (number|Long);

    /** DeployContractTransaction contractId. */
    public contractId: string;

    /** DeployContractTransaction wasmByteArray. */
    public wasmByteArray: Uint8Array;

    /**
     * Creates a new DeployContractTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeployContractTransaction instance
     */
    public static create(properties?: IDeployContractTransaction): DeployContractTransaction;

    /**
     * Encodes the specified DeployContractTransaction message. Does not implicitly {@link DeployContractTransaction.verify|verify} messages.
     * @param message DeployContractTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDeployContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DeployContractTransaction message, length delimited. Does not implicitly {@link DeployContractTransaction.verify|verify} messages.
     * @param message DeployContractTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDeployContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DeployContractTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DeployContractTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DeployContractTransaction;

    /**
     * Decodes a DeployContractTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DeployContractTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DeployContractTransaction;

    /**
     * Verifies a DeployContractTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DeployContractTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeployContractTransaction
     */
    public static fromObject(object: { [k: string]: any }): DeployContractTransaction;

    /**
     * Creates a plain object from a DeployContractTransaction message. Also converts values to other types if specified.
     * @param message DeployContractTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DeployContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DeployContractTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a FunctionCallTransaction. */
export interface IFunctionCallTransaction {

    /** FunctionCallTransaction nonce */
    nonce?: (number|Long|null);

    /** FunctionCallTransaction originator */
    originator?: (string|null);

    /** FunctionCallTransaction contractId */
    contractId?: (string|null);

    /** FunctionCallTransaction methodName */
    methodName?: (Uint8Array|null);

    /** FunctionCallTransaction args */
    args?: (Uint8Array|null);

    /** FunctionCallTransaction amount */
    amount?: (IUint128|null);
}

/** Represents a FunctionCallTransaction. */
export class FunctionCallTransaction implements IFunctionCallTransaction {

    /**
     * Constructs a new FunctionCallTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFunctionCallTransaction);

    /** FunctionCallTransaction nonce. */
    public nonce: (number|Long);

    /** FunctionCallTransaction originator. */
    public originator: string;

    /** FunctionCallTransaction contractId. */
    public contractId: string;

    /** FunctionCallTransaction methodName. */
    public methodName: Uint8Array;

    /** FunctionCallTransaction args. */
    public args: Uint8Array;

    /** FunctionCallTransaction amount. */
    public amount?: (IUint128|null);

    /**
     * Creates a new FunctionCallTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FunctionCallTransaction instance
     */
    public static create(properties?: IFunctionCallTransaction): FunctionCallTransaction;

    /**
     * Encodes the specified FunctionCallTransaction message. Does not implicitly {@link FunctionCallTransaction.verify|verify} messages.
     * @param message FunctionCallTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFunctionCallTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified FunctionCallTransaction message, length delimited. Does not implicitly {@link FunctionCallTransaction.verify|verify} messages.
     * @param message FunctionCallTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFunctionCallTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a FunctionCallTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FunctionCallTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): FunctionCallTransaction;

    /**
     * Decodes a FunctionCallTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FunctionCallTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): FunctionCallTransaction;

    /**
     * Verifies a FunctionCallTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FunctionCallTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FunctionCallTransaction
     */
    public static fromObject(object: { [k: string]: any }): FunctionCallTransaction;

    /**
     * Creates a plain object from a FunctionCallTransaction message. Also converts values to other types if specified.
     * @param message FunctionCallTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FunctionCallTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FunctionCallTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SendMoneyTransaction. */
export interface ISendMoneyTransaction {

    /** SendMoneyTransaction nonce */
    nonce?: (number|Long|null);

    /** SendMoneyTransaction originator */
    originator?: (string|null);

    /** SendMoneyTransaction receiver */
    receiver?: (string|null);

    /** SendMoneyTransaction amount */
    amount?: (IUint128|null);
}

/** Represents a SendMoneyTransaction. */
export class SendMoneyTransaction implements ISendMoneyTransaction {

    /**
     * Constructs a new SendMoneyTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISendMoneyTransaction);

    /** SendMoneyTransaction nonce. */
    public nonce: (number|Long);

    /** SendMoneyTransaction originator. */
    public originator: string;

    /** SendMoneyTransaction receiver. */
    public receiver: string;

    /** SendMoneyTransaction amount. */
    public amount?: (IUint128|null);

    /**
     * Creates a new SendMoneyTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SendMoneyTransaction instance
     */
    public static create(properties?: ISendMoneyTransaction): SendMoneyTransaction;

    /**
     * Encodes the specified SendMoneyTransaction message. Does not implicitly {@link SendMoneyTransaction.verify|verify} messages.
     * @param message SendMoneyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISendMoneyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SendMoneyTransaction message, length delimited. Does not implicitly {@link SendMoneyTransaction.verify|verify} messages.
     * @param message SendMoneyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISendMoneyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SendMoneyTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SendMoneyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SendMoneyTransaction;

    /**
     * Decodes a SendMoneyTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SendMoneyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SendMoneyTransaction;

    /**
     * Verifies a SendMoneyTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SendMoneyTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SendMoneyTransaction
     */
    public static fromObject(object: { [k: string]: any }): SendMoneyTransaction;

    /**
     * Creates a plain object from a SendMoneyTransaction message. Also converts values to other types if specified.
     * @param message SendMoneyTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SendMoneyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SendMoneyTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StakeTransaction. */
export interface IStakeTransaction {

    /** StakeTransaction nonce */
    nonce?: (number|Long|null);

    /** StakeTransaction originator */
    originator?: (string|null);

    /** StakeTransaction amount */
    amount?: (IUint128|null);

    /** StakeTransaction publicKey */
    publicKey?: (string|null);

    /** StakeTransaction blsPublicKey */
    blsPublicKey?: (string|null);
}

/** Represents a StakeTransaction. */
export class StakeTransaction implements IStakeTransaction {

    /**
     * Constructs a new StakeTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: IStakeTransaction);

    /** StakeTransaction nonce. */
    public nonce: (number|Long);

    /** StakeTransaction originator. */
    public originator: string;

    /** StakeTransaction amount. */
    public amount?: (IUint128|null);

    /** StakeTransaction publicKey. */
    public publicKey: string;

    /** StakeTransaction blsPublicKey. */
    public blsPublicKey: string;

    /**
     * Creates a new StakeTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns StakeTransaction instance
     */
    public static create(properties?: IStakeTransaction): StakeTransaction;

    /**
     * Encodes the specified StakeTransaction message. Does not implicitly {@link StakeTransaction.verify|verify} messages.
     * @param message StakeTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IStakeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified StakeTransaction message, length delimited. Does not implicitly {@link StakeTransaction.verify|verify} messages.
     * @param message StakeTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IStakeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StakeTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns StakeTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): StakeTransaction;

    /**
     * Decodes a StakeTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns StakeTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): StakeTransaction;

    /**
     * Verifies a StakeTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a StakeTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns StakeTransaction
     */
    public static fromObject(object: { [k: string]: any }): StakeTransaction;

    /**
     * Creates a plain object from a StakeTransaction message. Also converts values to other types if specified.
     * @param message StakeTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: StakeTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StakeTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SwapKeyTransaction. */
export interface ISwapKeyTransaction {

    /** SwapKeyTransaction nonce */
    nonce?: (number|Long|null);

    /** SwapKeyTransaction originator */
    originator?: (string|null);

    /** SwapKeyTransaction curKey */
    curKey?: (Uint8Array|null);

    /** SwapKeyTransaction newKey */
    newKey?: (Uint8Array|null);
}

/** Represents a SwapKeyTransaction. */
export class SwapKeyTransaction implements ISwapKeyTransaction {

    /**
     * Constructs a new SwapKeyTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISwapKeyTransaction);

    /** SwapKeyTransaction nonce. */
    public nonce: (number|Long);

    /** SwapKeyTransaction originator. */
    public originator: string;

    /** SwapKeyTransaction curKey. */
    public curKey: Uint8Array;

    /** SwapKeyTransaction newKey. */
    public newKey: Uint8Array;

    /**
     * Creates a new SwapKeyTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SwapKeyTransaction instance
     */
    public static create(properties?: ISwapKeyTransaction): SwapKeyTransaction;

    /**
     * Encodes the specified SwapKeyTransaction message. Does not implicitly {@link SwapKeyTransaction.verify|verify} messages.
     * @param message SwapKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISwapKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SwapKeyTransaction message, length delimited. Does not implicitly {@link SwapKeyTransaction.verify|verify} messages.
     * @param message SwapKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISwapKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SwapKeyTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SwapKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SwapKeyTransaction;

    /**
     * Decodes a SwapKeyTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SwapKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SwapKeyTransaction;

    /**
     * Verifies a SwapKeyTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SwapKeyTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SwapKeyTransaction
     */
    public static fromObject(object: { [k: string]: any }): SwapKeyTransaction;

    /**
     * Creates a plain object from a SwapKeyTransaction message. Also converts values to other types if specified.
     * @param message SwapKeyTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SwapKeyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SwapKeyTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an AddKeyTransaction. */
export interface IAddKeyTransaction {

    /** AddKeyTransaction nonce */
    nonce?: (number|Long|null);

    /** AddKeyTransaction originator */
    originator?: (string|null);

    /** AddKeyTransaction newKey */
    newKey?: (Uint8Array|null);

    /** AddKeyTransaction accessKey */
    accessKey?: (IAccessKey|null);
}

/** Represents an AddKeyTransaction. */
export class AddKeyTransaction implements IAddKeyTransaction {

    /**
     * Constructs a new AddKeyTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAddKeyTransaction);

    /** AddKeyTransaction nonce. */
    public nonce: (number|Long);

    /** AddKeyTransaction originator. */
    public originator: string;

    /** AddKeyTransaction newKey. */
    public newKey: Uint8Array;

    /** AddKeyTransaction accessKey. */
    public accessKey?: (IAccessKey|null);

    /**
     * Creates a new AddKeyTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AddKeyTransaction instance
     */
    public static create(properties?: IAddKeyTransaction): AddKeyTransaction;

    /**
     * Encodes the specified AddKeyTransaction message. Does not implicitly {@link AddKeyTransaction.verify|verify} messages.
     * @param message AddKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAddKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AddKeyTransaction message, length delimited. Does not implicitly {@link AddKeyTransaction.verify|verify} messages.
     * @param message AddKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAddKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AddKeyTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AddKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AddKeyTransaction;

    /**
     * Decodes an AddKeyTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AddKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AddKeyTransaction;

    /**
     * Verifies an AddKeyTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AddKeyTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AddKeyTransaction
     */
    public static fromObject(object: { [k: string]: any }): AddKeyTransaction;

    /**
     * Creates a plain object from an AddKeyTransaction message. Also converts values to other types if specified.
     * @param message AddKeyTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AddKeyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AddKeyTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DeleteKeyTransaction. */
export interface IDeleteKeyTransaction {

    /** DeleteKeyTransaction nonce */
    nonce?: (number|Long|null);

    /** DeleteKeyTransaction originator */
    originator?: (string|null);

    /** DeleteKeyTransaction curKey */
    curKey?: (Uint8Array|null);
}

/** Represents a DeleteKeyTransaction. */
export class DeleteKeyTransaction implements IDeleteKeyTransaction {

    /**
     * Constructs a new DeleteKeyTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDeleteKeyTransaction);

    /** DeleteKeyTransaction nonce. */
    public nonce: (number|Long);

    /** DeleteKeyTransaction originator. */
    public originator: string;

    /** DeleteKeyTransaction curKey. */
    public curKey: Uint8Array;

    /**
     * Creates a new DeleteKeyTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DeleteKeyTransaction instance
     */
    public static create(properties?: IDeleteKeyTransaction): DeleteKeyTransaction;

    /**
     * Encodes the specified DeleteKeyTransaction message. Does not implicitly {@link DeleteKeyTransaction.verify|verify} messages.
     * @param message DeleteKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDeleteKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DeleteKeyTransaction message, length delimited. Does not implicitly {@link DeleteKeyTransaction.verify|verify} messages.
     * @param message DeleteKeyTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDeleteKeyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DeleteKeyTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DeleteKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DeleteKeyTransaction;

    /**
     * Decodes a DeleteKeyTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DeleteKeyTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DeleteKeyTransaction;

    /**
     * Verifies a DeleteKeyTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DeleteKeyTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DeleteKeyTransaction
     */
    public static fromObject(object: { [k: string]: any }): DeleteKeyTransaction;

    /**
     * Creates a plain object from a DeleteKeyTransaction message. Also converts values to other types if specified.
     * @param message DeleteKeyTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DeleteKeyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DeleteKeyTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SignedTransaction. */
export interface ISignedTransaction {

    /** SignedTransaction signature */
    signature?: (Uint8Array|null);

    /** SignedTransaction publicKey */
    publicKey?: (google.protobuf.IBytesValue|null);

    /** SignedTransaction createAccount */
    createAccount?: (ICreateAccountTransaction|null);

    /** SignedTransaction deployContract */
    deployContract?: (IDeployContractTransaction|null);

    /** SignedTransaction functionCall */
    functionCall?: (IFunctionCallTransaction|null);

    /** SignedTransaction sendMoney */
    sendMoney?: (ISendMoneyTransaction|null);

    /** SignedTransaction stake */
    stake?: (IStakeTransaction|null);

    /** SignedTransaction swapKey */
    swapKey?: (ISwapKeyTransaction|null);

    /** SignedTransaction addKey */
    addKey?: (IAddKeyTransaction|null);

    /** SignedTransaction deleteKey */
    deleteKey?: (IDeleteKeyTransaction|null);
}

/** Represents a SignedTransaction. */
export class SignedTransaction implements ISignedTransaction {

    /**
     * Constructs a new SignedTransaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISignedTransaction);

    /** SignedTransaction signature. */
    public signature: Uint8Array;

    /** SignedTransaction publicKey. */
    public publicKey?: (google.protobuf.IBytesValue|null);

    /** SignedTransaction createAccount. */
    public createAccount?: (ICreateAccountTransaction|null);

    /** SignedTransaction deployContract. */
    public deployContract?: (IDeployContractTransaction|null);

    /** SignedTransaction functionCall. */
    public functionCall?: (IFunctionCallTransaction|null);

    /** SignedTransaction sendMoney. */
    public sendMoney?: (ISendMoneyTransaction|null);

    /** SignedTransaction stake. */
    public stake?: (IStakeTransaction|null);

    /** SignedTransaction swapKey. */
    public swapKey?: (ISwapKeyTransaction|null);

    /** SignedTransaction addKey. */
    public addKey?: (IAddKeyTransaction|null);

    /** SignedTransaction deleteKey. */
    public deleteKey?: (IDeleteKeyTransaction|null);

    /** SignedTransaction body. */
    public body?: ("createAccount"|"deployContract"|"functionCall"|"sendMoney"|"stake"|"swapKey"|"addKey"|"deleteKey");

    /**
     * Creates a new SignedTransaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SignedTransaction instance
     */
    public static create(properties?: ISignedTransaction): SignedTransaction;

    /**
     * Encodes the specified SignedTransaction message. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @param message SignedTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISignedTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SignedTransaction message, length delimited. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @param message SignedTransaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISignedTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SignedTransaction;

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SignedTransaction;

    /**
     * Verifies a SignedTransaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SignedTransaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SignedTransaction
     */
    public static fromObject(object: { [k: string]: any }): SignedTransaction;

    /**
     * Creates a plain object from a SignedTransaction message. Also converts values to other types if specified.
     * @param message SignedTransaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SignedTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SignedTransaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DoubleValue instance
             */
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;

            /**
             * Verifies a DoubleValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DoubleValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @param message DoubleValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DoubleValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatValue instance
             */
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;

            /**
             * Verifies a FloatValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @param message FloatValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|Long|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: (number|Long);

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int64Value instance
             */
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;

            /**
             * Verifies an Int64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @param message Int64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|Long|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: (number|Long);

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt64Value instance
             */
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;

            /**
             * Verifies a UInt64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @param message UInt64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int32Value instance
             */
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;

            /**
             * Verifies an Int32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @param message Int32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt32Value instance
             */
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;

            /**
             * Verifies a UInt32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @param message UInt32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BoolValue instance
             */
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;

            /**
             * Verifies a BoolValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BoolValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @param message BoolValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BoolValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;

            /**
             * Creates a new StringValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StringValue instance
             */
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;

            /**
             * Verifies a StringValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StringValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @param message StringValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StringValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BytesValue instance
             */
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;

            /**
             * Verifies a BytesValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BytesValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @param message BytesValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BytesValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Properties of an AccessKey. */
export interface IAccessKey {

    /** AccessKey amount */
    amount?: (IUint128|null);

    /** AccessKey balanceOwner */
    balanceOwner?: (google.protobuf.IStringValue|null);

    /** AccessKey contractId */
    contractId?: (google.protobuf.IStringValue|null);

    /** AccessKey methodName */
    methodName?: (google.protobuf.IBytesValue|null);
}

/** Represents an AccessKey. */
export class AccessKey implements IAccessKey {

    /**
     * Constructs a new AccessKey.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAccessKey);

    /** AccessKey amount. */
    public amount?: (IUint128|null);

    /** AccessKey balanceOwner. */
    public balanceOwner?: (google.protobuf.IStringValue|null);

    /** AccessKey contractId. */
    public contractId?: (google.protobuf.IStringValue|null);

    /** AccessKey methodName. */
    public methodName?: (google.protobuf.IBytesValue|null);

    /**
     * Creates a new AccessKey instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AccessKey instance
     */
    public static create(properties?: IAccessKey): AccessKey;

    /**
     * Encodes the specified AccessKey message. Does not implicitly {@link AccessKey.verify|verify} messages.
     * @param message AccessKey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAccessKey, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AccessKey message, length delimited. Does not implicitly {@link AccessKey.verify|verify} messages.
     * @param message AccessKey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAccessKey, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AccessKey message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AccessKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AccessKey;

    /**
     * Decodes an AccessKey message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AccessKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AccessKey;

    /**
     * Verifies an AccessKey message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AccessKey message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AccessKey
     */
    public static fromObject(object: { [k: string]: any }): AccessKey;

    /**
     * Creates a plain object from an AccessKey message. Also converts values to other types if specified.
     * @param message AccessKey
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AccessKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AccessKey to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Uint128. */
export interface IUint128 {

    /** Uint128 number */
    number?: (Uint8Array|null);
}

/** Provides container for unsigned 128 bit integers. */
export class Uint128 implements IUint128 {

    /**
     * Constructs a new Uint128.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUint128);

    /** Uint128 number. */
    public number: Uint8Array;

    /**
     * Creates a new Uint128 instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Uint128 instance
     */
    public static create(properties?: IUint128): Uint128;

    /**
     * Encodes the specified Uint128 message. Does not implicitly {@link Uint128.verify|verify} messages.
     * @param message Uint128 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUint128, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Uint128 message, length delimited. Does not implicitly {@link Uint128.verify|verify} messages.
     * @param message Uint128 message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUint128, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Uint128 message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Uint128
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Uint128;

    /**
     * Decodes an Uint128 message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Uint128
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Uint128;

    /**
     * Verifies an Uint128 message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Uint128 message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Uint128
     */
    public static fromObject(object: { [k: string]: any }): Uint128;

    /**
     * Creates a plain object from an Uint128 message. Also converts values to other types if specified.
     * @param message Uint128
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Uint128, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Uint128 to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
