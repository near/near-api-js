/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Action = (function() {

    /**
     * Properties of an Action.
     * @exports IAction
     * @interface IAction
     * @property {Action.ICreateAccount|null} [createAccount] Action createAccount
     * @property {Action.IDeployContract|null} [deployContract] Action deployContract
     * @property {Action.IFunctionCall|null} [functionCall] Action functionCall
     * @property {Action.ITransfer|null} [transfer] Action transfer
     * @property {Action.IStake|null} [stake] Action stake
     * @property {Action.IAddKey|null} [addKey] Action addKey
     * @property {Action.IDeleteKey|null} [deleteKey] Action deleteKey
     * @property {Action.IDeleteAccount|null} [deleteAccount] Action deleteAccount
     */

    /**
     * Constructs a new Action.
     * @exports Action
     * @classdesc Represents an Action.
     * @implements IAction
     * @constructor
     * @param {IAction=} [properties] Properties to set
     */
    function Action(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Action createAccount.
     * @member {Action.ICreateAccount|null|undefined} createAccount
     * @memberof Action
     * @instance
     */
    Action.prototype.createAccount = null;

    /**
     * Action deployContract.
     * @member {Action.IDeployContract|null|undefined} deployContract
     * @memberof Action
     * @instance
     */
    Action.prototype.deployContract = null;

    /**
     * Action functionCall.
     * @member {Action.IFunctionCall|null|undefined} functionCall
     * @memberof Action
     * @instance
     */
    Action.prototype.functionCall = null;

    /**
     * Action transfer.
     * @member {Action.ITransfer|null|undefined} transfer
     * @memberof Action
     * @instance
     */
    Action.prototype.transfer = null;

    /**
     * Action stake.
     * @member {Action.IStake|null|undefined} stake
     * @memberof Action
     * @instance
     */
    Action.prototype.stake = null;

    /**
     * Action addKey.
     * @member {Action.IAddKey|null|undefined} addKey
     * @memberof Action
     * @instance
     */
    Action.prototype.addKey = null;

    /**
     * Action deleteKey.
     * @member {Action.IDeleteKey|null|undefined} deleteKey
     * @memberof Action
     * @instance
     */
    Action.prototype.deleteKey = null;

    /**
     * Action deleteAccount.
     * @member {Action.IDeleteAccount|null|undefined} deleteAccount
     * @memberof Action
     * @instance
     */
    Action.prototype.deleteAccount = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Action action.
     * @member {"createAccount"|"deployContract"|"functionCall"|"transfer"|"stake"|"addKey"|"deleteKey"|"deleteAccount"|undefined} action
     * @memberof Action
     * @instance
     */
    Object.defineProperty(Action.prototype, "action", {
        get: $util.oneOfGetter($oneOfFields = ["createAccount", "deployContract", "functionCall", "transfer", "stake", "addKey", "deleteKey", "deleteAccount"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Action instance using the specified properties.
     * @function create
     * @memberof Action
     * @static
     * @param {IAction=} [properties] Properties to set
     * @returns {Action} Action instance
     */
    Action.create = function create(properties) {
        return new Action(properties);
    };

    /**
     * Encodes the specified Action message. Does not implicitly {@link Action.verify|verify} messages.
     * @function encode
     * @memberof Action
     * @static
     * @param {IAction} message Action message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Action.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.createAccount != null && message.hasOwnProperty("createAccount"))
            $root.Action.CreateAccount.encode(message.createAccount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.deployContract != null && message.hasOwnProperty("deployContract"))
            $root.Action.DeployContract.encode(message.deployContract, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.functionCall != null && message.hasOwnProperty("functionCall"))
            $root.Action.FunctionCall.encode(message.functionCall, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.transfer != null && message.hasOwnProperty("transfer"))
            $root.Action.Transfer.encode(message.transfer, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.stake != null && message.hasOwnProperty("stake"))
            $root.Action.Stake.encode(message.stake, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.addKey != null && message.hasOwnProperty("addKey"))
            $root.Action.AddKey.encode(message.addKey, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.deleteKey != null && message.hasOwnProperty("deleteKey"))
            $root.Action.DeleteKey.encode(message.deleteKey, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.deleteAccount != null && message.hasOwnProperty("deleteAccount"))
            $root.Action.DeleteAccount.encode(message.deleteAccount, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Action message, length delimited. Does not implicitly {@link Action.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Action
     * @static
     * @param {IAction} message Action message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Action.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Action message from the specified reader or buffer.
     * @function decode
     * @memberof Action
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Action} Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Action.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.createAccount = $root.Action.CreateAccount.decode(reader, reader.uint32());
                break;
            case 2:
                message.deployContract = $root.Action.DeployContract.decode(reader, reader.uint32());
                break;
            case 3:
                message.functionCall = $root.Action.FunctionCall.decode(reader, reader.uint32());
                break;
            case 4:
                message.transfer = $root.Action.Transfer.decode(reader, reader.uint32());
                break;
            case 5:
                message.stake = $root.Action.Stake.decode(reader, reader.uint32());
                break;
            case 6:
                message.addKey = $root.Action.AddKey.decode(reader, reader.uint32());
                break;
            case 7:
                message.deleteKey = $root.Action.DeleteKey.decode(reader, reader.uint32());
                break;
            case 8:
                message.deleteAccount = $root.Action.DeleteAccount.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Action message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Action
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Action} Action
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Action.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Action message.
     * @function verify
     * @memberof Action
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Action.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.createAccount != null && message.hasOwnProperty("createAccount")) {
            properties.action = 1;
            {
                var error = $root.Action.CreateAccount.verify(message.createAccount);
                if (error)
                    return "createAccount." + error;
            }
        }
        if (message.deployContract != null && message.hasOwnProperty("deployContract")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.DeployContract.verify(message.deployContract);
                if (error)
                    return "deployContract." + error;
            }
        }
        if (message.functionCall != null && message.hasOwnProperty("functionCall")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.FunctionCall.verify(message.functionCall);
                if (error)
                    return "functionCall." + error;
            }
        }
        if (message.transfer != null && message.hasOwnProperty("transfer")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.Transfer.verify(message.transfer);
                if (error)
                    return "transfer." + error;
            }
        }
        if (message.stake != null && message.hasOwnProperty("stake")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.Stake.verify(message.stake);
                if (error)
                    return "stake." + error;
            }
        }
        if (message.addKey != null && message.hasOwnProperty("addKey")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.AddKey.verify(message.addKey);
                if (error)
                    return "addKey." + error;
            }
        }
        if (message.deleteKey != null && message.hasOwnProperty("deleteKey")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.DeleteKey.verify(message.deleteKey);
                if (error)
                    return "deleteKey." + error;
            }
        }
        if (message.deleteAccount != null && message.hasOwnProperty("deleteAccount")) {
            if (properties.action === 1)
                return "action: multiple values";
            properties.action = 1;
            {
                var error = $root.Action.DeleteAccount.verify(message.deleteAccount);
                if (error)
                    return "deleteAccount." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Action message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Action
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Action} Action
     */
    Action.fromObject = function fromObject(object) {
        if (object instanceof $root.Action)
            return object;
        var message = new $root.Action();
        if (object.createAccount != null) {
            if (typeof object.createAccount !== "object")
                throw TypeError(".Action.createAccount: object expected");
            message.createAccount = $root.Action.CreateAccount.fromObject(object.createAccount);
        }
        if (object.deployContract != null) {
            if (typeof object.deployContract !== "object")
                throw TypeError(".Action.deployContract: object expected");
            message.deployContract = $root.Action.DeployContract.fromObject(object.deployContract);
        }
        if (object.functionCall != null) {
            if (typeof object.functionCall !== "object")
                throw TypeError(".Action.functionCall: object expected");
            message.functionCall = $root.Action.FunctionCall.fromObject(object.functionCall);
        }
        if (object.transfer != null) {
            if (typeof object.transfer !== "object")
                throw TypeError(".Action.transfer: object expected");
            message.transfer = $root.Action.Transfer.fromObject(object.transfer);
        }
        if (object.stake != null) {
            if (typeof object.stake !== "object")
                throw TypeError(".Action.stake: object expected");
            message.stake = $root.Action.Stake.fromObject(object.stake);
        }
        if (object.addKey != null) {
            if (typeof object.addKey !== "object")
                throw TypeError(".Action.addKey: object expected");
            message.addKey = $root.Action.AddKey.fromObject(object.addKey);
        }
        if (object.deleteKey != null) {
            if (typeof object.deleteKey !== "object")
                throw TypeError(".Action.deleteKey: object expected");
            message.deleteKey = $root.Action.DeleteKey.fromObject(object.deleteKey);
        }
        if (object.deleteAccount != null) {
            if (typeof object.deleteAccount !== "object")
                throw TypeError(".Action.deleteAccount: object expected");
            message.deleteAccount = $root.Action.DeleteAccount.fromObject(object.deleteAccount);
        }
        return message;
    };

    /**
     * Creates a plain object from an Action message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Action
     * @static
     * @param {Action} message Action
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Action.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.createAccount != null && message.hasOwnProperty("createAccount")) {
            object.createAccount = $root.Action.CreateAccount.toObject(message.createAccount, options);
            if (options.oneofs)
                object.action = "createAccount";
        }
        if (message.deployContract != null && message.hasOwnProperty("deployContract")) {
            object.deployContract = $root.Action.DeployContract.toObject(message.deployContract, options);
            if (options.oneofs)
                object.action = "deployContract";
        }
        if (message.functionCall != null && message.hasOwnProperty("functionCall")) {
            object.functionCall = $root.Action.FunctionCall.toObject(message.functionCall, options);
            if (options.oneofs)
                object.action = "functionCall";
        }
        if (message.transfer != null && message.hasOwnProperty("transfer")) {
            object.transfer = $root.Action.Transfer.toObject(message.transfer, options);
            if (options.oneofs)
                object.action = "transfer";
        }
        if (message.stake != null && message.hasOwnProperty("stake")) {
            object.stake = $root.Action.Stake.toObject(message.stake, options);
            if (options.oneofs)
                object.action = "stake";
        }
        if (message.addKey != null && message.hasOwnProperty("addKey")) {
            object.addKey = $root.Action.AddKey.toObject(message.addKey, options);
            if (options.oneofs)
                object.action = "addKey";
        }
        if (message.deleteKey != null && message.hasOwnProperty("deleteKey")) {
            object.deleteKey = $root.Action.DeleteKey.toObject(message.deleteKey, options);
            if (options.oneofs)
                object.action = "deleteKey";
        }
        if (message.deleteAccount != null && message.hasOwnProperty("deleteAccount")) {
            object.deleteAccount = $root.Action.DeleteAccount.toObject(message.deleteAccount, options);
            if (options.oneofs)
                object.action = "deleteAccount";
        }
        return object;
    };

    /**
     * Converts this Action to JSON.
     * @function toJSON
     * @memberof Action
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Action.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    Action.CreateAccount = (function() {

        /**
         * Properties of a CreateAccount.
         * @memberof Action
         * @interface ICreateAccount
         */

        /**
         * Constructs a new CreateAccount.
         * @memberof Action
         * @classdesc Represents a CreateAccount.
         * @implements ICreateAccount
         * @constructor
         * @param {Action.ICreateAccount=} [properties] Properties to set
         */
        function CreateAccount(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new CreateAccount instance using the specified properties.
         * @function create
         * @memberof Action.CreateAccount
         * @static
         * @param {Action.ICreateAccount=} [properties] Properties to set
         * @returns {Action.CreateAccount} CreateAccount instance
         */
        CreateAccount.create = function create(properties) {
            return new CreateAccount(properties);
        };

        /**
         * Encodes the specified CreateAccount message. Does not implicitly {@link Action.CreateAccount.verify|verify} messages.
         * @function encode
         * @memberof Action.CreateAccount
         * @static
         * @param {Action.ICreateAccount} message CreateAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateAccount.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified CreateAccount message, length delimited. Does not implicitly {@link Action.CreateAccount.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.CreateAccount
         * @static
         * @param {Action.ICreateAccount} message CreateAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateAccount.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateAccount message from the specified reader or buffer.
         * @function decode
         * @memberof Action.CreateAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.CreateAccount} CreateAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateAccount.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.CreateAccount();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateAccount message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.CreateAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.CreateAccount} CreateAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateAccount.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateAccount message.
         * @function verify
         * @memberof Action.CreateAccount
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateAccount.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a CreateAccount message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.CreateAccount
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.CreateAccount} CreateAccount
         */
        CreateAccount.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.CreateAccount)
                return object;
            return new $root.Action.CreateAccount();
        };

        /**
         * Creates a plain object from a CreateAccount message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.CreateAccount
         * @static
         * @param {Action.CreateAccount} message CreateAccount
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateAccount.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this CreateAccount to JSON.
         * @function toJSON
         * @memberof Action.CreateAccount
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateAccount.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateAccount;
    })();

    Action.DeployContract = (function() {

        /**
         * Properties of a DeployContract.
         * @memberof Action
         * @interface IDeployContract
         * @property {Uint8Array|null} [code] DeployContract code
         */

        /**
         * Constructs a new DeployContract.
         * @memberof Action
         * @classdesc Represents a DeployContract.
         * @implements IDeployContract
         * @constructor
         * @param {Action.IDeployContract=} [properties] Properties to set
         */
        function DeployContract(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeployContract code.
         * @member {Uint8Array} code
         * @memberof Action.DeployContract
         * @instance
         */
        DeployContract.prototype.code = $util.newBuffer([]);

        /**
         * Creates a new DeployContract instance using the specified properties.
         * @function create
         * @memberof Action.DeployContract
         * @static
         * @param {Action.IDeployContract=} [properties] Properties to set
         * @returns {Action.DeployContract} DeployContract instance
         */
        DeployContract.create = function create(properties) {
            return new DeployContract(properties);
        };

        /**
         * Encodes the specified DeployContract message. Does not implicitly {@link Action.DeployContract.verify|verify} messages.
         * @function encode
         * @memberof Action.DeployContract
         * @static
         * @param {Action.IDeployContract} message DeployContract message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeployContract.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.code);
            return writer;
        };

        /**
         * Encodes the specified DeployContract message, length delimited. Does not implicitly {@link Action.DeployContract.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.DeployContract
         * @static
         * @param {Action.IDeployContract} message DeployContract message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeployContract.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeployContract message from the specified reader or buffer.
         * @function decode
         * @memberof Action.DeployContract
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.DeployContract} DeployContract
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeployContract.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.DeployContract();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeployContract message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.DeployContract
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.DeployContract} DeployContract
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeployContract.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeployContract message.
         * @function verify
         * @memberof Action.DeployContract
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeployContract.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!(message.code && typeof message.code.length === "number" || $util.isString(message.code)))
                    return "code: buffer expected";
            return null;
        };

        /**
         * Creates a DeployContract message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.DeployContract
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.DeployContract} DeployContract
         */
        DeployContract.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.DeployContract)
                return object;
            var message = new $root.Action.DeployContract();
            if (object.code != null)
                if (typeof object.code === "string")
                    $util.base64.decode(object.code, message.code = $util.newBuffer($util.base64.length(object.code)), 0);
                else if (object.code.length)
                    message.code = object.code;
            return message;
        };

        /**
         * Creates a plain object from a DeployContract message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.DeployContract
         * @static
         * @param {Action.DeployContract} message DeployContract
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeployContract.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.code = "";
                else {
                    object.code = [];
                    if (options.bytes !== Array)
                        object.code = $util.newBuffer(object.code);
                }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = options.bytes === String ? $util.base64.encode(message.code, 0, message.code.length) : options.bytes === Array ? Array.prototype.slice.call(message.code) : message.code;
            return object;
        };

        /**
         * Converts this DeployContract to JSON.
         * @function toJSON
         * @memberof Action.DeployContract
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeployContract.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeployContract;
    })();

    Action.FunctionCall = (function() {

        /**
         * Properties of a FunctionCall.
         * @memberof Action
         * @interface IFunctionCall
         * @property {string|null} [methodName] FunctionCall methodName
         * @property {Uint8Array|null} [args] FunctionCall args
         * @property {number|Long|null} [gas] FunctionCall gas
         * @property {IUint128|null} [deposit] FunctionCall deposit
         */

        /**
         * Constructs a new FunctionCall.
         * @memberof Action
         * @classdesc Represents a FunctionCall.
         * @implements IFunctionCall
         * @constructor
         * @param {Action.IFunctionCall=} [properties] Properties to set
         */
        function FunctionCall(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FunctionCall methodName.
         * @member {string} methodName
         * @memberof Action.FunctionCall
         * @instance
         */
        FunctionCall.prototype.methodName = "";

        /**
         * FunctionCall args.
         * @member {Uint8Array} args
         * @memberof Action.FunctionCall
         * @instance
         */
        FunctionCall.prototype.args = $util.newBuffer([]);

        /**
         * FunctionCall gas.
         * @member {number|Long} gas
         * @memberof Action.FunctionCall
         * @instance
         */
        FunctionCall.prototype.gas = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FunctionCall deposit.
         * @member {IUint128|null|undefined} deposit
         * @memberof Action.FunctionCall
         * @instance
         */
        FunctionCall.prototype.deposit = null;

        /**
         * Creates a new FunctionCall instance using the specified properties.
         * @function create
         * @memberof Action.FunctionCall
         * @static
         * @param {Action.IFunctionCall=} [properties] Properties to set
         * @returns {Action.FunctionCall} FunctionCall instance
         */
        FunctionCall.create = function create(properties) {
            return new FunctionCall(properties);
        };

        /**
         * Encodes the specified FunctionCall message. Does not implicitly {@link Action.FunctionCall.verify|verify} messages.
         * @function encode
         * @memberof Action.FunctionCall
         * @static
         * @param {Action.IFunctionCall} message FunctionCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FunctionCall.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.methodName != null && message.hasOwnProperty("methodName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.methodName);
            if (message.args != null && message.hasOwnProperty("args"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.args);
            if (message.gas != null && message.hasOwnProperty("gas"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.gas);
            if (message.deposit != null && message.hasOwnProperty("deposit"))
                $root.Uint128.encode(message.deposit, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FunctionCall message, length delimited. Does not implicitly {@link Action.FunctionCall.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.FunctionCall
         * @static
         * @param {Action.IFunctionCall} message FunctionCall message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FunctionCall.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FunctionCall message from the specified reader or buffer.
         * @function decode
         * @memberof Action.FunctionCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.FunctionCall} FunctionCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FunctionCall.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.FunctionCall();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.methodName = reader.string();
                    break;
                case 2:
                    message.args = reader.bytes();
                    break;
                case 3:
                    message.gas = reader.uint64();
                    break;
                case 4:
                    message.deposit = $root.Uint128.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FunctionCall message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.FunctionCall
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.FunctionCall} FunctionCall
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FunctionCall.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FunctionCall message.
         * @function verify
         * @memberof Action.FunctionCall
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FunctionCall.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.methodName != null && message.hasOwnProperty("methodName"))
                if (!$util.isString(message.methodName))
                    return "methodName: string expected";
            if (message.args != null && message.hasOwnProperty("args"))
                if (!(message.args && typeof message.args.length === "number" || $util.isString(message.args)))
                    return "args: buffer expected";
            if (message.gas != null && message.hasOwnProperty("gas"))
                if (!$util.isInteger(message.gas) && !(message.gas && $util.isInteger(message.gas.low) && $util.isInteger(message.gas.high)))
                    return "gas: integer|Long expected";
            if (message.deposit != null && message.hasOwnProperty("deposit")) {
                var error = $root.Uint128.verify(message.deposit);
                if (error)
                    return "deposit." + error;
            }
            return null;
        };

        /**
         * Creates a FunctionCall message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.FunctionCall
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.FunctionCall} FunctionCall
         */
        FunctionCall.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.FunctionCall)
                return object;
            var message = new $root.Action.FunctionCall();
            if (object.methodName != null)
                message.methodName = String(object.methodName);
            if (object.args != null)
                if (typeof object.args === "string")
                    $util.base64.decode(object.args, message.args = $util.newBuffer($util.base64.length(object.args)), 0);
                else if (object.args.length)
                    message.args = object.args;
            if (object.gas != null)
                if ($util.Long)
                    (message.gas = $util.Long.fromValue(object.gas)).unsigned = true;
                else if (typeof object.gas === "string")
                    message.gas = parseInt(object.gas, 10);
                else if (typeof object.gas === "number")
                    message.gas = object.gas;
                else if (typeof object.gas === "object")
                    message.gas = new $util.LongBits(object.gas.low >>> 0, object.gas.high >>> 0).toNumber(true);
            if (object.deposit != null) {
                if (typeof object.deposit !== "object")
                    throw TypeError(".Action.FunctionCall.deposit: object expected");
                message.deposit = $root.Uint128.fromObject(object.deposit);
            }
            return message;
        };

        /**
         * Creates a plain object from a FunctionCall message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.FunctionCall
         * @static
         * @param {Action.FunctionCall} message FunctionCall
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FunctionCall.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.methodName = "";
                if (options.bytes === String)
                    object.args = "";
                else {
                    object.args = [];
                    if (options.bytes !== Array)
                        object.args = $util.newBuffer(object.args);
                }
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.gas = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.gas = options.longs === String ? "0" : 0;
                object.deposit = null;
            }
            if (message.methodName != null && message.hasOwnProperty("methodName"))
                object.methodName = message.methodName;
            if (message.args != null && message.hasOwnProperty("args"))
                object.args = options.bytes === String ? $util.base64.encode(message.args, 0, message.args.length) : options.bytes === Array ? Array.prototype.slice.call(message.args) : message.args;
            if (message.gas != null && message.hasOwnProperty("gas"))
                if (typeof message.gas === "number")
                    object.gas = options.longs === String ? String(message.gas) : message.gas;
                else
                    object.gas = options.longs === String ? $util.Long.prototype.toString.call(message.gas) : options.longs === Number ? new $util.LongBits(message.gas.low >>> 0, message.gas.high >>> 0).toNumber(true) : message.gas;
            if (message.deposit != null && message.hasOwnProperty("deposit"))
                object.deposit = $root.Uint128.toObject(message.deposit, options);
            return object;
        };

        /**
         * Converts this FunctionCall to JSON.
         * @function toJSON
         * @memberof Action.FunctionCall
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FunctionCall.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FunctionCall;
    })();

    Action.Transfer = (function() {

        /**
         * Properties of a Transfer.
         * @memberof Action
         * @interface ITransfer
         * @property {IUint128|null} [deposit] Transfer deposit
         */

        /**
         * Constructs a new Transfer.
         * @memberof Action
         * @classdesc Represents a Transfer.
         * @implements ITransfer
         * @constructor
         * @param {Action.ITransfer=} [properties] Properties to set
         */
        function Transfer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Transfer deposit.
         * @member {IUint128|null|undefined} deposit
         * @memberof Action.Transfer
         * @instance
         */
        Transfer.prototype.deposit = null;

        /**
         * Creates a new Transfer instance using the specified properties.
         * @function create
         * @memberof Action.Transfer
         * @static
         * @param {Action.ITransfer=} [properties] Properties to set
         * @returns {Action.Transfer} Transfer instance
         */
        Transfer.create = function create(properties) {
            return new Transfer(properties);
        };

        /**
         * Encodes the specified Transfer message. Does not implicitly {@link Action.Transfer.verify|verify} messages.
         * @function encode
         * @memberof Action.Transfer
         * @static
         * @param {Action.ITransfer} message Transfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transfer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.deposit != null && message.hasOwnProperty("deposit"))
                $root.Uint128.encode(message.deposit, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Transfer message, length delimited. Does not implicitly {@link Action.Transfer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Transfer
         * @static
         * @param {Action.ITransfer} message Transfer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Transfer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Transfer message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Transfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Transfer} Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transfer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Transfer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.deposit = $root.Uint128.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Transfer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Transfer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Transfer} Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Transfer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Transfer message.
         * @function verify
         * @memberof Action.Transfer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Transfer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.deposit != null && message.hasOwnProperty("deposit")) {
                var error = $root.Uint128.verify(message.deposit);
                if (error)
                    return "deposit." + error;
            }
            return null;
        };

        /**
         * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Transfer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Transfer} Transfer
         */
        Transfer.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Transfer)
                return object;
            var message = new $root.Action.Transfer();
            if (object.deposit != null) {
                if (typeof object.deposit !== "object")
                    throw TypeError(".Action.Transfer.deposit: object expected");
                message.deposit = $root.Uint128.fromObject(object.deposit);
            }
            return message;
        };

        /**
         * Creates a plain object from a Transfer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Transfer
         * @static
         * @param {Action.Transfer} message Transfer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Transfer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.deposit = null;
            if (message.deposit != null && message.hasOwnProperty("deposit"))
                object.deposit = $root.Uint128.toObject(message.deposit, options);
            return object;
        };

        /**
         * Converts this Transfer to JSON.
         * @function toJSON
         * @memberof Action.Transfer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Transfer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Transfer;
    })();

    Action.Stake = (function() {

        /**
         * Properties of a Stake.
         * @memberof Action
         * @interface IStake
         * @property {IUint128|null} [stake] Stake stake
         * @property {IPublicKey|null} [publicKey] Stake publicKey
         */

        /**
         * Constructs a new Stake.
         * @memberof Action
         * @classdesc Represents a Stake.
         * @implements IStake
         * @constructor
         * @param {Action.IStake=} [properties] Properties to set
         */
        function Stake(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Stake stake.
         * @member {IUint128|null|undefined} stake
         * @memberof Action.Stake
         * @instance
         */
        Stake.prototype.stake = null;

        /**
         * Stake publicKey.
         * @member {IPublicKey|null|undefined} publicKey
         * @memberof Action.Stake
         * @instance
         */
        Stake.prototype.publicKey = null;

        /**
         * Creates a new Stake instance using the specified properties.
         * @function create
         * @memberof Action.Stake
         * @static
         * @param {Action.IStake=} [properties] Properties to set
         * @returns {Action.Stake} Stake instance
         */
        Stake.create = function create(properties) {
            return new Stake(properties);
        };

        /**
         * Encodes the specified Stake message. Does not implicitly {@link Action.Stake.verify|verify} messages.
         * @function encode
         * @memberof Action.Stake
         * @static
         * @param {Action.IStake} message Stake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stake.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stake != null && message.hasOwnProperty("stake"))
                $root.Uint128.encode(message.stake, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                $root.PublicKey.encode(message.publicKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Stake message, length delimited. Does not implicitly {@link Action.Stake.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.Stake
         * @static
         * @param {Action.IStake} message Stake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stake.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stake message from the specified reader or buffer.
         * @function decode
         * @memberof Action.Stake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.Stake} Stake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stake.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.Stake();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.stake = $root.Uint128.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.publicKey = $root.PublicKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Stake message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.Stake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.Stake} Stake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stake.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stake message.
         * @function verify
         * @memberof Action.Stake
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stake.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stake != null && message.hasOwnProperty("stake")) {
                var error = $root.Uint128.verify(message.stake);
                if (error)
                    return "stake." + error;
            }
            if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
                var error = $root.PublicKey.verify(message.publicKey);
                if (error)
                    return "publicKey." + error;
            }
            return null;
        };

        /**
         * Creates a Stake message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.Stake
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.Stake} Stake
         */
        Stake.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.Stake)
                return object;
            var message = new $root.Action.Stake();
            if (object.stake != null) {
                if (typeof object.stake !== "object")
                    throw TypeError(".Action.Stake.stake: object expected");
                message.stake = $root.Uint128.fromObject(object.stake);
            }
            if (object.publicKey != null) {
                if (typeof object.publicKey !== "object")
                    throw TypeError(".Action.Stake.publicKey: object expected");
                message.publicKey = $root.PublicKey.fromObject(object.publicKey);
            }
            return message;
        };

        /**
         * Creates a plain object from a Stake message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.Stake
         * @static
         * @param {Action.Stake} message Stake
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stake.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.stake = null;
                object.publicKey = null;
            }
            if (message.stake != null && message.hasOwnProperty("stake"))
                object.stake = $root.Uint128.toObject(message.stake, options);
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = $root.PublicKey.toObject(message.publicKey, options);
            return object;
        };

        /**
         * Converts this Stake to JSON.
         * @function toJSON
         * @memberof Action.Stake
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stake.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Stake;
    })();

    Action.AddKey = (function() {

        /**
         * Properties of an AddKey.
         * @memberof Action
         * @interface IAddKey
         * @property {IPublicKey|null} [publicKey] AddKey publicKey
         * @property {IAccessKey|null} [accessKey] AddKey accessKey
         */

        /**
         * Constructs a new AddKey.
         * @memberof Action
         * @classdesc Represents an AddKey.
         * @implements IAddKey
         * @constructor
         * @param {Action.IAddKey=} [properties] Properties to set
         */
        function AddKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddKey publicKey.
         * @member {IPublicKey|null|undefined} publicKey
         * @memberof Action.AddKey
         * @instance
         */
        AddKey.prototype.publicKey = null;

        /**
         * AddKey accessKey.
         * @member {IAccessKey|null|undefined} accessKey
         * @memberof Action.AddKey
         * @instance
         */
        AddKey.prototype.accessKey = null;

        /**
         * Creates a new AddKey instance using the specified properties.
         * @function create
         * @memberof Action.AddKey
         * @static
         * @param {Action.IAddKey=} [properties] Properties to set
         * @returns {Action.AddKey} AddKey instance
         */
        AddKey.create = function create(properties) {
            return new AddKey(properties);
        };

        /**
         * Encodes the specified AddKey message. Does not implicitly {@link Action.AddKey.verify|verify} messages.
         * @function encode
         * @memberof Action.AddKey
         * @static
         * @param {Action.IAddKey} message AddKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                $root.PublicKey.encode(message.publicKey, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.accessKey != null && message.hasOwnProperty("accessKey"))
                $root.AccessKey.encode(message.accessKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AddKey message, length delimited. Does not implicitly {@link Action.AddKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.AddKey
         * @static
         * @param {Action.IAddKey} message AddKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddKey message from the specified reader or buffer.
         * @function decode
         * @memberof Action.AddKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.AddKey} AddKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.AddKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.publicKey = $root.PublicKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.accessKey = $root.AccessKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.AddKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.AddKey} AddKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddKey message.
         * @function verify
         * @memberof Action.AddKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
                var error = $root.PublicKey.verify(message.publicKey);
                if (error)
                    return "publicKey." + error;
            }
            if (message.accessKey != null && message.hasOwnProperty("accessKey")) {
                var error = $root.AccessKey.verify(message.accessKey);
                if (error)
                    return "accessKey." + error;
            }
            return null;
        };

        /**
         * Creates an AddKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.AddKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.AddKey} AddKey
         */
        AddKey.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.AddKey)
                return object;
            var message = new $root.Action.AddKey();
            if (object.publicKey != null) {
                if (typeof object.publicKey !== "object")
                    throw TypeError(".Action.AddKey.publicKey: object expected");
                message.publicKey = $root.PublicKey.fromObject(object.publicKey);
            }
            if (object.accessKey != null) {
                if (typeof object.accessKey !== "object")
                    throw TypeError(".Action.AddKey.accessKey: object expected");
                message.accessKey = $root.AccessKey.fromObject(object.accessKey);
            }
            return message;
        };

        /**
         * Creates a plain object from an AddKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.AddKey
         * @static
         * @param {Action.AddKey} message AddKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.publicKey = null;
                object.accessKey = null;
            }
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = $root.PublicKey.toObject(message.publicKey, options);
            if (message.accessKey != null && message.hasOwnProperty("accessKey"))
                object.accessKey = $root.AccessKey.toObject(message.accessKey, options);
            return object;
        };

        /**
         * Converts this AddKey to JSON.
         * @function toJSON
         * @memberof Action.AddKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddKey;
    })();

    Action.DeleteKey = (function() {

        /**
         * Properties of a DeleteKey.
         * @memberof Action
         * @interface IDeleteKey
         * @property {IPublicKey|null} [publicKey] DeleteKey publicKey
         */

        /**
         * Constructs a new DeleteKey.
         * @memberof Action
         * @classdesc Represents a DeleteKey.
         * @implements IDeleteKey
         * @constructor
         * @param {Action.IDeleteKey=} [properties] Properties to set
         */
        function DeleteKey(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteKey publicKey.
         * @member {IPublicKey|null|undefined} publicKey
         * @memberof Action.DeleteKey
         * @instance
         */
        DeleteKey.prototype.publicKey = null;

        /**
         * Creates a new DeleteKey instance using the specified properties.
         * @function create
         * @memberof Action.DeleteKey
         * @static
         * @param {Action.IDeleteKey=} [properties] Properties to set
         * @returns {Action.DeleteKey} DeleteKey instance
         */
        DeleteKey.create = function create(properties) {
            return new DeleteKey(properties);
        };

        /**
         * Encodes the specified DeleteKey message. Does not implicitly {@link Action.DeleteKey.verify|verify} messages.
         * @function encode
         * @memberof Action.DeleteKey
         * @static
         * @param {Action.IDeleteKey} message DeleteKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                $root.PublicKey.encode(message.publicKey, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DeleteKey message, length delimited. Does not implicitly {@link Action.DeleteKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.DeleteKey
         * @static
         * @param {Action.IDeleteKey} message DeleteKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeleteKey message from the specified reader or buffer.
         * @function decode
         * @memberof Action.DeleteKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.DeleteKey} DeleteKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.DeleteKey();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.publicKey = $root.PublicKey.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeleteKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.DeleteKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.DeleteKey} DeleteKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteKey message.
         * @function verify
         * @memberof Action.DeleteKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
                var error = $root.PublicKey.verify(message.publicKey);
                if (error)
                    return "publicKey." + error;
            }
            return null;
        };

        /**
         * Creates a DeleteKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.DeleteKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.DeleteKey} DeleteKey
         */
        DeleteKey.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.DeleteKey)
                return object;
            var message = new $root.Action.DeleteKey();
            if (object.publicKey != null) {
                if (typeof object.publicKey !== "object")
                    throw TypeError(".Action.DeleteKey.publicKey: object expected");
                message.publicKey = $root.PublicKey.fromObject(object.publicKey);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeleteKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.DeleteKey
         * @static
         * @param {Action.DeleteKey} message DeleteKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.publicKey = null;
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = $root.PublicKey.toObject(message.publicKey, options);
            return object;
        };

        /**
         * Converts this DeleteKey to JSON.
         * @function toJSON
         * @memberof Action.DeleteKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteKey;
    })();

    Action.DeleteAccount = (function() {

        /**
         * Properties of a DeleteAccount.
         * @memberof Action
         * @interface IDeleteAccount
         * @property {string|null} [beneficiaryId] DeleteAccount beneficiaryId
         */

        /**
         * Constructs a new DeleteAccount.
         * @memberof Action
         * @classdesc Represents a DeleteAccount.
         * @implements IDeleteAccount
         * @constructor
         * @param {Action.IDeleteAccount=} [properties] Properties to set
         */
        function DeleteAccount(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteAccount beneficiaryId.
         * @member {string} beneficiaryId
         * @memberof Action.DeleteAccount
         * @instance
         */
        DeleteAccount.prototype.beneficiaryId = "";

        /**
         * Creates a new DeleteAccount instance using the specified properties.
         * @function create
         * @memberof Action.DeleteAccount
         * @static
         * @param {Action.IDeleteAccount=} [properties] Properties to set
         * @returns {Action.DeleteAccount} DeleteAccount instance
         */
        DeleteAccount.create = function create(properties) {
            return new DeleteAccount(properties);
        };

        /**
         * Encodes the specified DeleteAccount message. Does not implicitly {@link Action.DeleteAccount.verify|verify} messages.
         * @function encode
         * @memberof Action.DeleteAccount
         * @static
         * @param {Action.IDeleteAccount} message DeleteAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteAccount.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.beneficiaryId != null && message.hasOwnProperty("beneficiaryId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.beneficiaryId);
            return writer;
        };

        /**
         * Encodes the specified DeleteAccount message, length delimited. Does not implicitly {@link Action.DeleteAccount.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Action.DeleteAccount
         * @static
         * @param {Action.IDeleteAccount} message DeleteAccount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteAccount.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeleteAccount message from the specified reader or buffer.
         * @function decode
         * @memberof Action.DeleteAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Action.DeleteAccount} DeleteAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteAccount.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Action.DeleteAccount();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.beneficiaryId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeleteAccount message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Action.DeleteAccount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Action.DeleteAccount} DeleteAccount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteAccount.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteAccount message.
         * @function verify
         * @memberof Action.DeleteAccount
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteAccount.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.beneficiaryId != null && message.hasOwnProperty("beneficiaryId"))
                if (!$util.isString(message.beneficiaryId))
                    return "beneficiaryId: string expected";
            return null;
        };

        /**
         * Creates a DeleteAccount message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Action.DeleteAccount
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Action.DeleteAccount} DeleteAccount
         */
        DeleteAccount.fromObject = function fromObject(object) {
            if (object instanceof $root.Action.DeleteAccount)
                return object;
            var message = new $root.Action.DeleteAccount();
            if (object.beneficiaryId != null)
                message.beneficiaryId = String(object.beneficiaryId);
            return message;
        };

        /**
         * Creates a plain object from a DeleteAccount message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Action.DeleteAccount
         * @static
         * @param {Action.DeleteAccount} message DeleteAccount
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteAccount.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.beneficiaryId = "";
            if (message.beneficiaryId != null && message.hasOwnProperty("beneficiaryId"))
                object.beneficiaryId = message.beneficiaryId;
            return object;
        };

        /**
         * Converts this DeleteAccount to JSON.
         * @function toJSON
         * @memberof Action.DeleteAccount
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteAccount.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeleteAccount;
    })();

    return Action;
})();

$root.Transaction = (function() {

    /**
     * Properties of a Transaction.
     * @exports ITransaction
     * @interface ITransaction
     * @property {string|null} [signerId] Transaction signerId
     * @property {IPublicKey|null} [publicKey] Transaction publicKey
     * @property {number|Long|null} [nonce] Transaction nonce
     * @property {string|null} [receiverId] Transaction receiverId
     * @property {Array.<IAction>|null} [actions] Transaction actions
     */

    /**
     * Constructs a new Transaction.
     * @exports Transaction
     * @classdesc Represents a Transaction.
     * @implements ITransaction
     * @constructor
     * @param {ITransaction=} [properties] Properties to set
     */
    function Transaction(properties) {
        this.actions = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Transaction signerId.
     * @member {string} signerId
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.signerId = "";

    /**
     * Transaction publicKey.
     * @member {IPublicKey|null|undefined} publicKey
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.publicKey = null;

    /**
     * Transaction nonce.
     * @member {number|Long} nonce
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Transaction receiverId.
     * @member {string} receiverId
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.receiverId = "";

    /**
     * Transaction actions.
     * @member {Array.<IAction>} actions
     * @memberof Transaction
     * @instance
     */
    Transaction.prototype.actions = $util.emptyArray;

    /**
     * Creates a new Transaction instance using the specified properties.
     * @function create
     * @memberof Transaction
     * @static
     * @param {ITransaction=} [properties] Properties to set
     * @returns {Transaction} Transaction instance
     */
    Transaction.create = function create(properties) {
        return new Transaction(properties);
    };

    /**
     * Encodes the specified Transaction message. Does not implicitly {@link Transaction.verify|verify} messages.
     * @function encode
     * @memberof Transaction
     * @static
     * @param {ITransaction} message Transaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Transaction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signerId != null && message.hasOwnProperty("signerId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.signerId);
        if (message.publicKey != null && message.hasOwnProperty("publicKey"))
            $root.PublicKey.encode(message.publicKey, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.nonce);
        if (message.receiverId != null && message.hasOwnProperty("receiverId"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.receiverId);
        if (message.actions != null && message.actions.length)
            for (var i = 0; i < message.actions.length; ++i)
                $root.Action.encode(message.actions[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Transaction message, length delimited. Does not implicitly {@link Transaction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Transaction
     * @static
     * @param {ITransaction} message Transaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Transaction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Transaction message from the specified reader or buffer.
     * @function decode
     * @memberof Transaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Transaction} Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Transaction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Transaction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signerId = reader.string();
                break;
            case 2:
                message.publicKey = $root.PublicKey.decode(reader, reader.uint32());
                break;
            case 3:
                message.nonce = reader.uint64();
                break;
            case 4:
                message.receiverId = reader.string();
                break;
            case 5:
                if (!(message.actions && message.actions.length))
                    message.actions = [];
                message.actions.push($root.Action.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Transaction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Transaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Transaction} Transaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Transaction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Transaction message.
     * @function verify
     * @memberof Transaction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Transaction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signerId != null && message.hasOwnProperty("signerId"))
            if (!$util.isString(message.signerId))
                return "signerId: string expected";
        if (message.publicKey != null && message.hasOwnProperty("publicKey")) {
            var error = $root.PublicKey.verify(message.publicKey);
            if (error)
                return "publicKey." + error;
        }
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                return "nonce: integer|Long expected";
        if (message.receiverId != null && message.hasOwnProperty("receiverId"))
            if (!$util.isString(message.receiverId))
                return "receiverId: string expected";
        if (message.actions != null && message.hasOwnProperty("actions")) {
            if (!Array.isArray(message.actions))
                return "actions: array expected";
            for (var i = 0; i < message.actions.length; ++i) {
                var error = $root.Action.verify(message.actions[i]);
                if (error)
                    return "actions." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Transaction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Transaction} Transaction
     */
    Transaction.fromObject = function fromObject(object) {
        if (object instanceof $root.Transaction)
            return object;
        var message = new $root.Transaction();
        if (object.signerId != null)
            message.signerId = String(object.signerId);
        if (object.publicKey != null) {
            if (typeof object.publicKey !== "object")
                throw TypeError(".Transaction.publicKey: object expected");
            message.publicKey = $root.PublicKey.fromObject(object.publicKey);
        }
        if (object.nonce != null)
            if ($util.Long)
                (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
            else if (typeof object.nonce === "string")
                message.nonce = parseInt(object.nonce, 10);
            else if (typeof object.nonce === "number")
                message.nonce = object.nonce;
            else if (typeof object.nonce === "object")
                message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
        if (object.receiverId != null)
            message.receiverId = String(object.receiverId);
        if (object.actions) {
            if (!Array.isArray(object.actions))
                throw TypeError(".Transaction.actions: array expected");
            message.actions = [];
            for (var i = 0; i < object.actions.length; ++i) {
                if (typeof object.actions[i] !== "object")
                    throw TypeError(".Transaction.actions: object expected");
                message.actions[i] = $root.Action.fromObject(object.actions[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a Transaction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Transaction
     * @static
     * @param {Transaction} message Transaction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Transaction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.actions = [];
        if (options.defaults) {
            object.signerId = "";
            object.publicKey = null;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.nonce = options.longs === String ? "0" : 0;
            object.receiverId = "";
        }
        if (message.signerId != null && message.hasOwnProperty("signerId"))
            object.signerId = message.signerId;
        if (message.publicKey != null && message.hasOwnProperty("publicKey"))
            object.publicKey = $root.PublicKey.toObject(message.publicKey, options);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (typeof message.nonce === "number")
                object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
            else
                object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
        if (message.receiverId != null && message.hasOwnProperty("receiverId"))
            object.receiverId = message.receiverId;
        if (message.actions && message.actions.length) {
            object.actions = [];
            for (var j = 0; j < message.actions.length; ++j)
                object.actions[j] = $root.Action.toObject(message.actions[j], options);
        }
        return object;
    };

    /**
     * Converts this Transaction to JSON.
     * @function toJSON
     * @memberof Transaction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Transaction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Transaction;
})();

$root.SignedTransaction = (function() {

    /**
     * Properties of a SignedTransaction.
     * @exports ISignedTransaction
     * @interface ISignedTransaction
     * @property {Uint8Array|null} [signature] SignedTransaction signature
     * @property {ITransaction|null} [transaction] SignedTransaction transaction
     */

    /**
     * Constructs a new SignedTransaction.
     * @exports SignedTransaction
     * @classdesc Represents a SignedTransaction.
     * @implements ISignedTransaction
     * @constructor
     * @param {ISignedTransaction=} [properties] Properties to set
     */
    function SignedTransaction(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SignedTransaction signature.
     * @member {Uint8Array} signature
     * @memberof SignedTransaction
     * @instance
     */
    SignedTransaction.prototype.signature = $util.newBuffer([]);

    /**
     * SignedTransaction transaction.
     * @member {ITransaction|null|undefined} transaction
     * @memberof SignedTransaction
     * @instance
     */
    SignedTransaction.prototype.transaction = null;

    /**
     * Creates a new SignedTransaction instance using the specified properties.
     * @function create
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction=} [properties] Properties to set
     * @returns {SignedTransaction} SignedTransaction instance
     */
    SignedTransaction.create = function create(properties) {
        return new SignedTransaction(properties);
    };

    /**
     * Encodes the specified SignedTransaction message. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @function encode
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction} message SignedTransaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedTransaction.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.signature);
        if (message.transaction != null && message.hasOwnProperty("transaction"))
            $root.Transaction.encode(message.transaction, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SignedTransaction message, length delimited. Does not implicitly {@link SignedTransaction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SignedTransaction
     * @static
     * @param {ISignedTransaction} message SignedTransaction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedTransaction.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer.
     * @function decode
     * @memberof SignedTransaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SignedTransaction} SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedTransaction.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SignedTransaction();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signature = reader.bytes();
                break;
            case 2:
                message.transaction = $root.Transaction.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SignedTransaction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SignedTransaction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SignedTransaction} SignedTransaction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedTransaction.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SignedTransaction message.
     * @function verify
     * @memberof SignedTransaction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SignedTransaction.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                return "signature: buffer expected";
        if (message.transaction != null && message.hasOwnProperty("transaction")) {
            var error = $root.Transaction.verify(message.transaction);
            if (error)
                return "transaction." + error;
        }
        return null;
    };

    /**
     * Creates a SignedTransaction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SignedTransaction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SignedTransaction} SignedTransaction
     */
    SignedTransaction.fromObject = function fromObject(object) {
        if (object instanceof $root.SignedTransaction)
            return object;
        var message = new $root.SignedTransaction();
        if (object.signature != null)
            if (typeof object.signature === "string")
                $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
            else if (object.signature.length)
                message.signature = object.signature;
        if (object.transaction != null) {
            if (typeof object.transaction !== "object")
                throw TypeError(".SignedTransaction.transaction: object expected");
            message.transaction = $root.Transaction.fromObject(object.transaction);
        }
        return message;
    };

    /**
     * Creates a plain object from a SignedTransaction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SignedTransaction
     * @static
     * @param {SignedTransaction} message SignedTransaction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SignedTransaction.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.signature = "";
            else {
                object.signature = [];
                if (options.bytes !== Array)
                    object.signature = $util.newBuffer(object.signature);
            }
            object.transaction = null;
        }
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
        if (message.transaction != null && message.hasOwnProperty("transaction"))
            object.transaction = $root.Transaction.toObject(message.transaction, options);
        return object;
    };

    /**
     * Converts this SignedTransaction to JSON.
     * @function toJSON
     * @memberof SignedTransaction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SignedTransaction.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SignedTransaction;
})();

$root.AccessKey = (function() {

    /**
     * Properties of an AccessKey.
     * @exports IAccessKey
     * @interface IAccessKey
     * @property {IUint128|null} [amount] AccessKey amount
     * @property {google.protobuf.IStringValue|null} [balanceOwner] AccessKey balanceOwner
     * @property {google.protobuf.IStringValue|null} [contractId] AccessKey contractId
     * @property {google.protobuf.IBytesValue|null} [methodName] AccessKey methodName
     */

    /**
     * Constructs a new AccessKey.
     * @exports AccessKey
     * @classdesc Represents an AccessKey.
     * @implements IAccessKey
     * @constructor
     * @param {IAccessKey=} [properties] Properties to set
     */
    function AccessKey(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AccessKey amount.
     * @member {IUint128|null|undefined} amount
     * @memberof AccessKey
     * @instance
     */
    AccessKey.prototype.amount = null;

    /**
     * AccessKey balanceOwner.
     * @member {google.protobuf.IStringValue|null|undefined} balanceOwner
     * @memberof AccessKey
     * @instance
     */
    AccessKey.prototype.balanceOwner = null;

    /**
     * AccessKey contractId.
     * @member {google.protobuf.IStringValue|null|undefined} contractId
     * @memberof AccessKey
     * @instance
     */
    AccessKey.prototype.contractId = null;

    /**
     * AccessKey methodName.
     * @member {google.protobuf.IBytesValue|null|undefined} methodName
     * @memberof AccessKey
     * @instance
     */
    AccessKey.prototype.methodName = null;

    /**
     * Creates a new AccessKey instance using the specified properties.
     * @function create
     * @memberof AccessKey
     * @static
     * @param {IAccessKey=} [properties] Properties to set
     * @returns {AccessKey} AccessKey instance
     */
    AccessKey.create = function create(properties) {
        return new AccessKey(properties);
    };

    /**
     * Encodes the specified AccessKey message. Does not implicitly {@link AccessKey.verify|verify} messages.
     * @function encode
     * @memberof AccessKey
     * @static
     * @param {IAccessKey} message AccessKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccessKey.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.amount != null && message.hasOwnProperty("amount"))
            $root.Uint128.encode(message.amount, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.balanceOwner != null && message.hasOwnProperty("balanceOwner"))
            $root.google.protobuf.StringValue.encode(message.balanceOwner, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.contractId != null && message.hasOwnProperty("contractId"))
            $root.google.protobuf.StringValue.encode(message.contractId, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.methodName != null && message.hasOwnProperty("methodName"))
            $root.google.protobuf.BytesValue.encode(message.methodName, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified AccessKey message, length delimited. Does not implicitly {@link AccessKey.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AccessKey
     * @static
     * @param {IAccessKey} message AccessKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AccessKey.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AccessKey message from the specified reader or buffer.
     * @function decode
     * @memberof AccessKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AccessKey} AccessKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccessKey.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AccessKey();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.amount = $root.Uint128.decode(reader, reader.uint32());
                break;
            case 2:
                message.balanceOwner = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            case 3:
                message.contractId = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            case 4:
                message.methodName = $root.google.protobuf.BytesValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AccessKey message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AccessKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AccessKey} AccessKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AccessKey.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AccessKey message.
     * @function verify
     * @memberof AccessKey
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AccessKey.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.amount != null && message.hasOwnProperty("amount")) {
            var error = $root.Uint128.verify(message.amount);
            if (error)
                return "amount." + error;
        }
        if (message.balanceOwner != null && message.hasOwnProperty("balanceOwner")) {
            var error = $root.google.protobuf.StringValue.verify(message.balanceOwner);
            if (error)
                return "balanceOwner." + error;
        }
        if (message.contractId != null && message.hasOwnProperty("contractId")) {
            var error = $root.google.protobuf.StringValue.verify(message.contractId);
            if (error)
                return "contractId." + error;
        }
        if (message.methodName != null && message.hasOwnProperty("methodName")) {
            var error = $root.google.protobuf.BytesValue.verify(message.methodName);
            if (error)
                return "methodName." + error;
        }
        return null;
    };

    /**
     * Creates an AccessKey message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AccessKey
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AccessKey} AccessKey
     */
    AccessKey.fromObject = function fromObject(object) {
        if (object instanceof $root.AccessKey)
            return object;
        var message = new $root.AccessKey();
        if (object.amount != null) {
            if (typeof object.amount !== "object")
                throw TypeError(".AccessKey.amount: object expected");
            message.amount = $root.Uint128.fromObject(object.amount);
        }
        if (object.balanceOwner != null) {
            if (typeof object.balanceOwner !== "object")
                throw TypeError(".AccessKey.balanceOwner: object expected");
            message.balanceOwner = $root.google.protobuf.StringValue.fromObject(object.balanceOwner);
        }
        if (object.contractId != null) {
            if (typeof object.contractId !== "object")
                throw TypeError(".AccessKey.contractId: object expected");
            message.contractId = $root.google.protobuf.StringValue.fromObject(object.contractId);
        }
        if (object.methodName != null) {
            if (typeof object.methodName !== "object")
                throw TypeError(".AccessKey.methodName: object expected");
            message.methodName = $root.google.protobuf.BytesValue.fromObject(object.methodName);
        }
        return message;
    };

    /**
     * Creates a plain object from an AccessKey message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AccessKey
     * @static
     * @param {AccessKey} message AccessKey
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AccessKey.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.amount = null;
            object.balanceOwner = null;
            object.contractId = null;
            object.methodName = null;
        }
        if (message.amount != null && message.hasOwnProperty("amount"))
            object.amount = $root.Uint128.toObject(message.amount, options);
        if (message.balanceOwner != null && message.hasOwnProperty("balanceOwner"))
            object.balanceOwner = $root.google.protobuf.StringValue.toObject(message.balanceOwner, options);
        if (message.contractId != null && message.hasOwnProperty("contractId"))
            object.contractId = $root.google.protobuf.StringValue.toObject(message.contractId, options);
        if (message.methodName != null && message.hasOwnProperty("methodName"))
            object.methodName = $root.google.protobuf.BytesValue.toObject(message.methodName, options);
        return object;
    };

    /**
     * Converts this AccessKey to JSON.
     * @function toJSON
     * @memberof AccessKey
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AccessKey.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return AccessKey;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.DoubleValue = (function() {

            /**
             * Properties of a DoubleValue.
             * @memberof google.protobuf
             * @interface IDoubleValue
             * @property {number|null} [value] DoubleValue value
             */

            /**
             * Constructs a new DoubleValue.
             * @memberof google.protobuf
             * @classdesc Represents a DoubleValue.
             * @implements IDoubleValue
             * @constructor
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             */
            function DoubleValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DoubleValue value.
             * @member {number} value
             * @memberof google.protobuf.DoubleValue
             * @instance
             */
            DoubleValue.prototype.value = 0;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             * @returns {google.protobuf.DoubleValue} DoubleValue instance
             */
            DoubleValue.create = function create(properties) {
                return new DoubleValue(properties);
            };

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                return writer;
            };

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DoubleValue message.
             * @function verify
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DoubleValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DoubleValue} DoubleValue
             */
            DoubleValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.DoubleValue)
                    return object;
                var message = new $root.google.protobuf.DoubleValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.DoubleValue} message DoubleValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DoubleValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this DoubleValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.DoubleValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DoubleValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DoubleValue;
        })();

        protobuf.FloatValue = (function() {

            /**
             * Properties of a FloatValue.
             * @memberof google.protobuf
             * @interface IFloatValue
             * @property {number|null} [value] FloatValue value
             */

            /**
             * Constructs a new FloatValue.
             * @memberof google.protobuf
             * @classdesc Represents a FloatValue.
             * @implements IFloatValue
             * @constructor
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             */
            function FloatValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FloatValue value.
             * @member {number} value
             * @memberof google.protobuf.FloatValue
             * @instance
             */
            FloatValue.prototype.value = 0;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             * @returns {google.protobuf.FloatValue} FloatValue instance
             */
            FloatValue.create = function create(properties) {
                return new FloatValue(properties);
            };

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
                return writer;
            };

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FloatValue message.
             * @function verify
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FloatValue} FloatValue
             */
            FloatValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FloatValue)
                    return object;
                var message = new $root.google.protobuf.FloatValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.FloatValue} message FloatValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FloatValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this FloatValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.FloatValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FloatValue;
        })();

        protobuf.Int64Value = (function() {

            /**
             * Properties of an Int64Value.
             * @memberof google.protobuf
             * @interface IInt64Value
             * @property {number|Long|null} [value] Int64Value value
             */

            /**
             * Constructs a new Int64Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int64Value.
             * @implements IInt64Value
             * @constructor
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             */
            function Int64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.Int64Value
             * @instance
             */
            Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.Int64Value} Int64Value instance
             */
            Int64Value.create = function create(properties) {
                return new Int64Value(properties);
            };

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int64Value message.
             * @function verify
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int64Value} Int64Value
             */
            Int64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int64Value)
                    return object;
                var message = new $root.google.protobuf.Int64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.Int64Value} message Int64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                return object;
            };

            /**
             * Converts this Int64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int64Value;
        })();

        protobuf.UInt64Value = (function() {

            /**
             * Properties of a UInt64Value.
             * @memberof google.protobuf
             * @interface IUInt64Value
             * @property {number|Long|null} [value] UInt64Value value
             */

            /**
             * Constructs a new UInt64Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt64Value.
             * @implements IUInt64Value
             * @constructor
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             */
            function UInt64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.UInt64Value
             * @instance
             */
            UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt64Value} UInt64Value instance
             */
            UInt64Value.create = function create(properties) {
                return new UInt64Value(properties);
            };

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt64Value message.
             * @function verify
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt64Value} UInt64Value
             */
            UInt64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt64Value)
                    return object;
                var message = new $root.google.protobuf.UInt64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = true;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.UInt64Value} message UInt64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                return object;
            };

            /**
             * Converts this UInt64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt64Value;
        })();

        protobuf.Int32Value = (function() {

            /**
             * Properties of an Int32Value.
             * @memberof google.protobuf
             * @interface IInt32Value
             * @property {number|null} [value] Int32Value value
             */

            /**
             * Constructs a new Int32Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int32Value.
             * @implements IInt32Value
             * @constructor
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             */
            function Int32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int32Value value.
             * @member {number} value
             * @memberof google.protobuf.Int32Value
             * @instance
             */
            Int32Value.prototype.value = 0;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.Int32Value} Int32Value instance
             */
            Int32Value.create = function create(properties) {
                return new Int32Value(properties);
            };

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int32Value message.
             * @function verify
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int32Value} Int32Value
             */
            Int32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int32Value)
                    return object;
                var message = new $root.google.protobuf.Int32Value();
                if (object.value != null)
                    message.value = object.value | 0;
                return message;
            };

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.Int32Value} message Int32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Int32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int32Value;
        })();

        protobuf.UInt32Value = (function() {

            /**
             * Properties of a UInt32Value.
             * @memberof google.protobuf
             * @interface IUInt32Value
             * @property {number|null} [value] UInt32Value value
             */

            /**
             * Constructs a new UInt32Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt32Value.
             * @implements IUInt32Value
             * @constructor
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             */
            function UInt32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt32Value value.
             * @member {number} value
             * @memberof google.protobuf.UInt32Value
             * @instance
             */
            UInt32Value.prototype.value = 0;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt32Value} UInt32Value instance
             */
            UInt32Value.create = function create(properties) {
                return new UInt32Value(properties);
            };

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt32Value message.
             * @function verify
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt32Value} UInt32Value
             */
            UInt32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt32Value)
                    return object;
                var message = new $root.google.protobuf.UInt32Value();
                if (object.value != null)
                    message.value = object.value >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.UInt32Value} message UInt32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this UInt32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt32Value;
        })();

        protobuf.BoolValue = (function() {

            /**
             * Properties of a BoolValue.
             * @memberof google.protobuf
             * @interface IBoolValue
             * @property {boolean|null} [value] BoolValue value
             */

            /**
             * Constructs a new BoolValue.
             * @memberof google.protobuf
             * @classdesc Represents a BoolValue.
             * @implements IBoolValue
             * @constructor
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             */
            function BoolValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BoolValue value.
             * @member {boolean} value
             * @memberof google.protobuf.BoolValue
             * @instance
             */
            BoolValue.prototype.value = false;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             * @returns {google.protobuf.BoolValue} BoolValue instance
             */
            BoolValue.create = function create(properties) {
                return new BoolValue(properties);
            };

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                return writer;
            };

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BoolValue message.
             * @function verify
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BoolValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "boolean")
                        return "value: boolean expected";
                return null;
            };

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BoolValue} BoolValue
             */
            BoolValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BoolValue)
                    return object;
                var message = new $root.google.protobuf.BoolValue();
                if (object.value != null)
                    message.value = Boolean(object.value);
                return message;
            };

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.BoolValue} message BoolValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BoolValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = false;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this BoolValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BoolValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BoolValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BoolValue;
        })();

        protobuf.StringValue = (function() {

            /**
             * Properties of a StringValue.
             * @memberof google.protobuf
             * @interface IStringValue
             * @property {string|null} [value] StringValue value
             */

            /**
             * Constructs a new StringValue.
             * @memberof google.protobuf
             * @classdesc Represents a StringValue.
             * @implements IStringValue
             * @constructor
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             */
            function StringValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StringValue value.
             * @member {string} value
             * @memberof google.protobuf.StringValue
             * @instance
             */
            StringValue.prototype.value = "";

            /**
             * Creates a new StringValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             * @returns {google.protobuf.StringValue} StringValue instance
             */
            StringValue.create = function create(properties) {
                return new StringValue(properties);
            };

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StringValue message.
             * @function verify
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StringValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.StringValue} StringValue
             */
            StringValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.StringValue)
                    return object;
                var message = new $root.google.protobuf.StringValue();
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.StringValue} message StringValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StringValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = "";
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this StringValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.StringValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StringValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return StringValue;
        })();

        protobuf.BytesValue = (function() {

            /**
             * Properties of a BytesValue.
             * @memberof google.protobuf
             * @interface IBytesValue
             * @property {Uint8Array|null} [value] BytesValue value
             */

            /**
             * Constructs a new BytesValue.
             * @memberof google.protobuf
             * @classdesc Represents a BytesValue.
             * @implements IBytesValue
             * @constructor
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             */
            function BytesValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BytesValue value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.BytesValue
             * @instance
             */
            BytesValue.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             * @returns {google.protobuf.BytesValue} BytesValue instance
             */
            BytesValue.create = function create(properties) {
                return new BytesValue(properties);
            };

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BytesValue message.
             * @function verify
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytesValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BytesValue} BytesValue
             */
            BytesValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BytesValue)
                    return object;
                var message = new $root.google.protobuf.BytesValue();
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.BytesValue} message BytesValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytesValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this BytesValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BytesValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytesValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BytesValue;
        })();

        return protobuf;
    })();

    return google;
})();

$root.Uint128 = (function() {

    /**
     * Properties of an Uint128.
     * @exports IUint128
     * @interface IUint128
     * @property {Uint8Array|null} [number] Uint128 number
     */

    /**
     * Constructs a new Uint128.
     * @exports Uint128
     * @classdesc Provides container for unsigned 128 bit integers.
     * @implements IUint128
     * @constructor
     * @param {IUint128=} [properties] Properties to set
     */
    function Uint128(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Uint128 number.
     * @member {Uint8Array} number
     * @memberof Uint128
     * @instance
     */
    Uint128.prototype.number = $util.newBuffer([]);

    /**
     * Creates a new Uint128 instance using the specified properties.
     * @function create
     * @memberof Uint128
     * @static
     * @param {IUint128=} [properties] Properties to set
     * @returns {Uint128} Uint128 instance
     */
    Uint128.create = function create(properties) {
        return new Uint128(properties);
    };

    /**
     * Encodes the specified Uint128 message. Does not implicitly {@link Uint128.verify|verify} messages.
     * @function encode
     * @memberof Uint128
     * @static
     * @param {IUint128} message Uint128 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Uint128.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.number != null && message.hasOwnProperty("number"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.number);
        return writer;
    };

    /**
     * Encodes the specified Uint128 message, length delimited. Does not implicitly {@link Uint128.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Uint128
     * @static
     * @param {IUint128} message Uint128 message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Uint128.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Uint128 message from the specified reader or buffer.
     * @function decode
     * @memberof Uint128
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Uint128} Uint128
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Uint128.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Uint128();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.number = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Uint128 message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Uint128
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Uint128} Uint128
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Uint128.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Uint128 message.
     * @function verify
     * @memberof Uint128
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Uint128.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.number != null && message.hasOwnProperty("number"))
            if (!(message.number && typeof message.number.length === "number" || $util.isString(message.number)))
                return "number: buffer expected";
        return null;
    };

    /**
     * Creates an Uint128 message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Uint128
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Uint128} Uint128
     */
    Uint128.fromObject = function fromObject(object) {
        if (object instanceof $root.Uint128)
            return object;
        var message = new $root.Uint128();
        if (object.number != null)
            if (typeof object.number === "string")
                $util.base64.decode(object.number, message.number = $util.newBuffer($util.base64.length(object.number)), 0);
            else if (object.number.length)
                message.number = object.number;
        return message;
    };

    /**
     * Creates a plain object from an Uint128 message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Uint128
     * @static
     * @param {Uint128} message Uint128
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Uint128.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.number = "";
            else {
                object.number = [];
                if (options.bytes !== Array)
                    object.number = $util.newBuffer(object.number);
            }
        if (message.number != null && message.hasOwnProperty("number"))
            object.number = options.bytes === String ? $util.base64.encode(message.number, 0, message.number.length) : options.bytes === Array ? Array.prototype.slice.call(message.number) : message.number;
        return object;
    };

    /**
     * Converts this Uint128 to JSON.
     * @function toJSON
     * @memberof Uint128
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Uint128.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Uint128;
})();

$root.PublicKey = (function() {

    /**
     * Properties of a PublicKey.
     * @exports IPublicKey
     * @interface IPublicKey
     * @property {PublicKey.KeyType|null} [keyType] PublicKey keyType
     * @property {Uint8Array|null} [data] PublicKey data
     */

    /**
     * Constructs a new PublicKey.
     * @exports PublicKey
     * @classdesc Represents a PublicKey.
     * @implements IPublicKey
     * @constructor
     * @param {IPublicKey=} [properties] Properties to set
     */
    function PublicKey(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PublicKey keyType.
     * @member {PublicKey.KeyType} keyType
     * @memberof PublicKey
     * @instance
     */
    PublicKey.prototype.keyType = 0;

    /**
     * PublicKey data.
     * @member {Uint8Array} data
     * @memberof PublicKey
     * @instance
     */
    PublicKey.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new PublicKey instance using the specified properties.
     * @function create
     * @memberof PublicKey
     * @static
     * @param {IPublicKey=} [properties] Properties to set
     * @returns {PublicKey} PublicKey instance
     */
    PublicKey.create = function create(properties) {
        return new PublicKey(properties);
    };

    /**
     * Encodes the specified PublicKey message. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @function encode
     * @memberof PublicKey
     * @static
     * @param {IPublicKey} message PublicKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PublicKey.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.keyType);
        if (message.data != null && message.hasOwnProperty("data"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified PublicKey message, length delimited. Does not implicitly {@link PublicKey.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PublicKey
     * @static
     * @param {IPublicKey} message PublicKey message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PublicKey.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PublicKey message from the specified reader or buffer.
     * @function decode
     * @memberof PublicKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PublicKey} PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PublicKey.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PublicKey();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.keyType = reader.int32();
                break;
            case 2:
                message.data = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PublicKey message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PublicKey
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PublicKey} PublicKey
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PublicKey.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PublicKey message.
     * @function verify
     * @memberof PublicKey
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PublicKey.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            switch (message.keyType) {
            default:
                return "keyType: enum value expected";
            case 0:
                break;
            }
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a PublicKey message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PublicKey
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PublicKey} PublicKey
     */
    PublicKey.fromObject = function fromObject(object) {
        if (object instanceof $root.PublicKey)
            return object;
        var message = new $root.PublicKey();
        switch (object.keyType) {
        case "ED25519":
        case 0:
            message.keyType = 0;
            break;
        }
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a PublicKey message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PublicKey
     * @static
     * @param {PublicKey} message PublicKey
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PublicKey.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.keyType = options.enums === String ? "ED25519" : 0;
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            object.keyType = options.enums === String ? $root.PublicKey.KeyType[message.keyType] : message.keyType;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this PublicKey to JSON.
     * @function toJSON
     * @memberof PublicKey
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PublicKey.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * KeyType enum.
     * @name PublicKey.KeyType
     * @enum {string}
     * @property {number} ED25519=0 ED25519 value
     */
    PublicKey.KeyType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ED25519"] = 0;
        return values;
    })();

    return PublicKey;
})();

module.exports = $root;
