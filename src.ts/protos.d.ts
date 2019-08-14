import * as $protobuf from "protobufjs";
/** Properties of an Action. */
export interface IAction {

    /** Action createAccount */
    createAccount?: (Action.ICreateAccount|null);

    /** Action deployContract */
    deployContract?: (Action.IDeployContract|null);

    /** Action functionCall */
    functionCall?: (Action.IFunctionCall|null);

    /** Action transfer */
    transfer?: (Action.ITransfer|null);

    /** Action stake */
    stake?: (Action.IStake|null);

    /** Action addKey */
    addKey?: (Action.IAddKey|null);

    /** Action deleteKey */
    deleteKey?: (Action.IDeleteKey|null);

    /** Action deleteAccount */
    deleteAccount?: (Action.IDeleteAccount|null);
}

/** Represents an Action. */
export class Action implements IAction {

    /**
     * Constructs a new Action.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAction);

    /** Action createAccount. */
    public createAccount?: (Action.ICreateAccount|null);

    /** Action deployContract. */
    public deployContract?: (Action.IDeployContract|null);

    /** Action functionCall. */
    public functionCall?: (Action.IFunctionCall|null);

    /** Action transfer. */
    public transfer?: (Action.ITransfer|null);

    /** Action stake. */
    public stake?: (Action.IStake|null);

    /** Action addKey. */
    public addKey?: (Action.IAddKey|null);

    /** Action deleteKey. */
    public deleteKey?: (Action.IDeleteKey|null);

    /** Action deleteAccount. */
    public deleteAccount?: (Action.IDeleteAccount|null);

    /** Action action. */
    public action?: ("createAccount"|"deployContract"|"functionCall"|"transfer"|"stake"|"addKey"|"deleteKey"|"deleteAccount");

    /**
     * Creates a new Action instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Action instance
     */
    public static create(properties?: IAction): Action;

    /**
     * Encodes the specified Action message. Does not implicitly {@link Action.verify|verify} messages.
     * @param message Action message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Action message, length delimited. Does not implicitly {@link Action.verify|verify} messages.
     * @param message Action message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Action message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action;

    /**
     * Decodes an Action message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action;

    /**
     * Verifies an Action message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Action message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Action
     */
    public static fromObject(object: { [k: string]: any }): Action;

    /**
     * Creates a plain object from an Action message. Also converts values to other types if specified.
     * @param message Action
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Action, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Action to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Action {

    /** Properties of a CreateAccount. */
    interface ICreateAccount {
    }

    /** Represents a CreateAccount. */
    class CreateAccount implements ICreateAccount {

        /**
         * Constructs a new CreateAccount.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.ICreateAccount);

        /**
         * Creates a new CreateAccount instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateAccount instance
         */
        public static create(properties?: Action.ICreateAccount): Action.CreateAccount;

        /**
         * Encodes the specified CreateAccount message. Does not implicitly {@link Action.CreateAccount.verify|verify} messages.
         * @param message CreateAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateAccount message, length delimited. Does not implicitly {@link Action.CreateAccount.verify|verify} messages.
         * @param message CreateAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.ICreateAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateAccount message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.CreateAccount;

        /**
         * Decodes a CreateAccount message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.CreateAccount;

        /**
         * Verifies a CreateAccount message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateAccount message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateAccount
         */
        public static fromObject(object: { [k: string]: any }): Action.CreateAccount;

        /**
         * Creates a plain object from a CreateAccount message. Also converts values to other types if specified.
         * @param message CreateAccount
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.CreateAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateAccount to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeployContract. */
    interface IDeployContract {

        /** DeployContract code */
        code?: (Uint8Array|null);
    }

    /** Represents a DeployContract. */
    class DeployContract implements IDeployContract {

        /**
         * Constructs a new DeployContract.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IDeployContract);

        /** DeployContract code. */
        public code: Uint8Array;

        /**
         * Creates a new DeployContract instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeployContract instance
         */
        public static create(properties?: Action.IDeployContract): Action.DeployContract;

        /**
         * Encodes the specified DeployContract message. Does not implicitly {@link Action.DeployContract.verify|verify} messages.
         * @param message DeployContract message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IDeployContract, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeployContract message, length delimited. Does not implicitly {@link Action.DeployContract.verify|verify} messages.
         * @param message DeployContract message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IDeployContract, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeployContract message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeployContract
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.DeployContract;

        /**
         * Decodes a DeployContract message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeployContract
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.DeployContract;

        /**
         * Verifies a DeployContract message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeployContract message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeployContract
         */
        public static fromObject(object: { [k: string]: any }): Action.DeployContract;

        /**
         * Creates a plain object from a DeployContract message. Also converts values to other types if specified.
         * @param message DeployContract
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.DeployContract, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeployContract to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FunctionCall. */
    interface IFunctionCall {

        /** FunctionCall methodName */
        methodName?: (string|null);

        /** FunctionCall args */
        args?: (Uint8Array|null);

        /** FunctionCall gas */
        gas?: (number|Long|null);

        /** FunctionCall deposit */
        deposit?: (IUint128|null);
    }

    /** Represents a FunctionCall. */
    class FunctionCall implements IFunctionCall {

        /**
         * Constructs a new FunctionCall.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IFunctionCall);

        /** FunctionCall methodName. */
        public methodName: string;

        /** FunctionCall args. */
        public args: Uint8Array;

        /** FunctionCall gas. */
        public gas: (number|Long);

        /** FunctionCall deposit. */
        public deposit?: (IUint128|null);

        /**
         * Creates a new FunctionCall instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FunctionCall instance
         */
        public static create(properties?: Action.IFunctionCall): Action.FunctionCall;

        /**
         * Encodes the specified FunctionCall message. Does not implicitly {@link Action.FunctionCall.verify|verify} messages.
         * @param message FunctionCall message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IFunctionCall, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FunctionCall message, length delimited. Does not implicitly {@link Action.FunctionCall.verify|verify} messages.
         * @param message FunctionCall message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IFunctionCall, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FunctionCall message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FunctionCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.FunctionCall;

        /**
         * Decodes a FunctionCall message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FunctionCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.FunctionCall;

        /**
         * Verifies a FunctionCall message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FunctionCall message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FunctionCall
         */
        public static fromObject(object: { [k: string]: any }): Action.FunctionCall;

        /**
         * Creates a plain object from a FunctionCall message. Also converts values to other types if specified.
         * @param message FunctionCall
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.FunctionCall, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FunctionCall to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Transfer. */
    interface ITransfer {

        /** Transfer deposit */
        deposit?: (IUint128|null);
    }

    /** Represents a Transfer. */
    class Transfer implements ITransfer {

        /**
         * Constructs a new Transfer.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.ITransfer);

        /** Transfer deposit. */
        public deposit?: (IUint128|null);

        /**
         * Creates a new Transfer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transfer instance
         */
        public static create(properties?: Action.ITransfer): Action.Transfer;

        /**
         * Encodes the specified Transfer message. Does not implicitly {@link Action.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transfer message, length delimited. Does not implicitly {@link Action.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transfer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Transfer;

        /**
         * Decodes a Transfer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Transfer;

        /**
         * Verifies a Transfer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transfer
         */
        public static fromObject(object: { [k: string]: any }): Action.Transfer;

        /**
         * Creates a plain object from a Transfer message. Also converts values to other types if specified.
         * @param message Transfer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Transfer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transfer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Stake. */
    interface IStake {

        /** Stake stake */
        stake?: (IUint128|null);

        /** Stake publicKey */
        publicKey?: (IPublicKey|null);
    }

    /** Represents a Stake. */
    class Stake implements IStake {

        /**
         * Constructs a new Stake.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IStake);

        /** Stake stake. */
        public stake?: (IUint128|null);

        /** Stake publicKey. */
        public publicKey?: (IPublicKey|null);

        /**
         * Creates a new Stake instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Stake instance
         */
        public static create(properties?: Action.IStake): Action.Stake;

        /**
         * Encodes the specified Stake message. Does not implicitly {@link Action.Stake.verify|verify} messages.
         * @param message Stake message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IStake, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Stake message, length delimited. Does not implicitly {@link Action.Stake.verify|verify} messages.
         * @param message Stake message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IStake, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Stake message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Stake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.Stake;

        /**
         * Decodes a Stake message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Stake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.Stake;

        /**
         * Verifies a Stake message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Stake message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Stake
         */
        public static fromObject(object: { [k: string]: any }): Action.Stake;

        /**
         * Creates a plain object from a Stake message. Also converts values to other types if specified.
         * @param message Stake
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.Stake, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Stake to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddKey. */
    interface IAddKey {

        /** AddKey publicKey */
        publicKey?: (IPublicKey|null);

        /** AddKey accessKey */
        accessKey?: (IAccessKey|null);
    }

    /** Represents an AddKey. */
    class AddKey implements IAddKey {

        /**
         * Constructs a new AddKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IAddKey);

        /** AddKey publicKey. */
        public publicKey?: (IPublicKey|null);

        /** AddKey accessKey. */
        public accessKey?: (IAccessKey|null);

        /**
         * Creates a new AddKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddKey instance
         */
        public static create(properties?: Action.IAddKey): Action.AddKey;

        /**
         * Encodes the specified AddKey message. Does not implicitly {@link Action.AddKey.verify|verify} messages.
         * @param message AddKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IAddKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddKey message, length delimited. Does not implicitly {@link Action.AddKey.verify|verify} messages.
         * @param message AddKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IAddKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.AddKey;

        /**
         * Decodes an AddKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.AddKey;

        /**
         * Verifies an AddKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddKey
         */
        public static fromObject(object: { [k: string]: any }): Action.AddKey;

        /**
         * Creates a plain object from an AddKey message. Also converts values to other types if specified.
         * @param message AddKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.AddKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteKey. */
    interface IDeleteKey {

        /** DeleteKey publicKey */
        publicKey?: (IPublicKey|null);
    }

    /** Represents a DeleteKey. */
    class DeleteKey implements IDeleteKey {

        /**
         * Constructs a new DeleteKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IDeleteKey);

        /** DeleteKey publicKey. */
        public publicKey?: (IPublicKey|null);

        /**
         * Creates a new DeleteKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteKey instance
         */
        public static create(properties?: Action.IDeleteKey): Action.DeleteKey;

        /**
         * Encodes the specified DeleteKey message. Does not implicitly {@link Action.DeleteKey.verify|verify} messages.
         * @param message DeleteKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IDeleteKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteKey message, length delimited. Does not implicitly {@link Action.DeleteKey.verify|verify} messages.
         * @param message DeleteKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IDeleteKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.DeleteKey;

        /**
         * Decodes a DeleteKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.DeleteKey;

        /**
         * Verifies a DeleteKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteKey
         */
        public static fromObject(object: { [k: string]: any }): Action.DeleteKey;

        /**
         * Creates a plain object from a DeleteKey message. Also converts values to other types if specified.
         * @param message DeleteKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.DeleteKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeleteAccount. */
    interface IDeleteAccount {

        /** DeleteAccount beneficiaryId */
        beneficiaryId?: (string|null);
    }

    /** Represents a DeleteAccount. */
    class DeleteAccount implements IDeleteAccount {

        /**
         * Constructs a new DeleteAccount.
         * @param [properties] Properties to set
         */
        constructor(properties?: Action.IDeleteAccount);

        /** DeleteAccount beneficiaryId. */
        public beneficiaryId: string;

        /**
         * Creates a new DeleteAccount instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteAccount instance
         */
        public static create(properties?: Action.IDeleteAccount): Action.DeleteAccount;

        /**
         * Encodes the specified DeleteAccount message. Does not implicitly {@link Action.DeleteAccount.verify|verify} messages.
         * @param message DeleteAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: Action.IDeleteAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteAccount message, length delimited. Does not implicitly {@link Action.DeleteAccount.verify|verify} messages.
         * @param message DeleteAccount message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: Action.IDeleteAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteAccount message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Action.DeleteAccount;

        /**
         * Decodes a DeleteAccount message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Action.DeleteAccount;

        /**
         * Verifies a DeleteAccount message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteAccount message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteAccount
         */
        public static fromObject(object: { [k: string]: any }): Action.DeleteAccount;

        /**
         * Creates a plain object from a DeleteAccount message. Also converts values to other types if specified.
         * @param message DeleteAccount
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: Action.DeleteAccount, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteAccount to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Properties of a Transaction. */
export interface ITransaction {

    /** Transaction signerId */
    signerId?: (string|null);

    /** Transaction publicKey */
    publicKey?: (IPublicKey|null);

    /** Transaction nonce */
    nonce?: (number|Long|null);

    /** Transaction receiverId */
    receiverId?: (string|null);

    /** Transaction actions */
    actions?: (IAction[]|null);
}

/** Represents a Transaction. */
export class Transaction implements ITransaction {

    /**
     * Constructs a new Transaction.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITransaction);

    /** Transaction signerId. */
    public signerId: string;

    /** Transaction publicKey. */
    public publicKey?: (IPublicKey|null);

    /** Transaction nonce. */
    public nonce: (number|Long);

    /** Transaction receiverId. */
    public receiverId: string;

    /** Transaction actions. */
    public actions: IAction[];

    /**
     * Creates a new Transaction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Transaction instance
     */
    public static create(properties?: ITransaction): Transaction;

    /**
     * Encodes the specified Transaction message. Does not implicitly {@link Transaction.verify|verify} messages.
     * @param message Transaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Transaction message, length delimited. Does not implicitly {@link Transaction.verify|verify} messages.
     * @param message Transaction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Transaction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Transaction;

    /**
     * Decodes a Transaction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Transaction;

    /**
     * Verifies a Transaction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Transaction
     */
    public static fromObject(object: { [k: string]: any }): Transaction;

    /**
     * Creates a plain object from a Transaction message. Also converts values to other types if specified.
     * @param message Transaction
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Transaction to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SignedTransaction. */
export interface ISignedTransaction {

    /** SignedTransaction signature */
    signature?: (Uint8Array|null);

    /** SignedTransaction transaction */
    transaction?: (ITransaction|null);
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

    /** SignedTransaction transaction. */
    public transaction?: (ITransaction|null);

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

/** Properties of a PublicKey. */
export interface IPublicKey {

    /** PublicKey keyType */
    keyType?: (PublicKey.KeyType|null);

    /** PublicKey data */
    data?: (Uint8Array|null);
}

/** Represents a PublicKey. */
export class PublicKey implements IPublicKey {

    /**
     * Constructs a new PublicKey.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPublicKey);

    /** PublicKey keyType. */
    public keyType: PublicKey.KeyType;

    /** PublicKey data. */
    public data: Uint8Array;

    /**
     * Creates a new PublicKey instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PublicKey instance
     */
    public static create(properties?: IPublicKey): PublicKey;

    /**
     * Encodes the specified PublicKey message. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @param message PublicKey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPublicKey, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @param message PublicKey message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPublicKey, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PublicKey message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PublicKey;

    /**
     * Decodes a PublicKey message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PublicKey;

    /**
     * Verifies a PublicKey message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PublicKey
     */
    public static fromObject(object: { [k: string]: any }): PublicKey;

    /**
     * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
     * @param message PublicKey
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PublicKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PublicKey to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace PublicKey {

    /** KeyType enum. */
    enum KeyType {
        ED25519 = 0
    }
}
