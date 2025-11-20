/**
 * Information about a single type (e.g. return type).
 */
export type AbiType =
    | {
          serialization_type: 'json';
          type_schema: Schema;
      }
    | {
          serialization_type: 'borsh';
          type_schema: unknown;
      };
/**
 * A JSON Schema.
 */
export type Schema = boolean | SchemaObject;
/**
 * A type which can be serialized as a single item, or multiple items.
 *
 * In some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.
 */
export type SingleOrVecFor_Schema = Schema | Schema[];
/**
 * A type which can be serialized as a single item, or multiple items.
 *
 * In some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.
 */
export type SingleOrVecFor_InstanceType = InstanceType | InstanceType[];
/**
 * The possible types of values in JSON Schema documents.
 *
 * See [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
 */
export type InstanceType = 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';
/**
 * Function kind regulates whether this function's invocation requires a transaction (so-called call functions) or not (view functions).
 */
export type AbiFunctionKind = 'view' | 'call';
/**
 * Function can have multiple modifiers that can change its semantics.
 */
export type AbiFunctionModifier = 'init' | 'private' | 'payable';
/**
 * A list of function parameters sharing the same serialization type.
 */
export type AbiParameters =
    | {
          args: AbiJsonParameter[];
          serialization_type: 'json';
      }
    | {
          args: AbiBorshParameter[];
          serialization_type: 'borsh';
      };

/**
 * Contract ABI.
 */
export interface AbiRoot {
    /**
     * Core ABI information (functions and types).
     */
    body: AbiBody;
    /**
     * Metadata information about the contract.
     */
    metadata: AbiMetadata;
    /**
     * Semver of the ABI schema format.
     */
    schema_version: string;
}
/**
 * Core ABI information.
 */
export interface AbiBody {
    /**
     * ABIs of all contract's functions.
     */
    functions: AbiFunction[];
    /**
     * Root JSON Schema containing all types referenced in the functions.
     */
    root_schema: RootSchema;
}
/**
 * ABI of a single function.
 */
export interface AbiFunction {
    /**
     * Type identifiers of the callbacks of the function.
     */
    callbacks?: AbiType[];
    /**
     * Type identifier of the vararg callbacks of the function.
     */
    callbacks_vec?: AbiType | null;
    /**
     * Human-readable documentation parsed from the source file.
     */
    doc?: string | null;
    /**
     * Function kind that regulates whether the function has to be invoked from a transaction.
     */
    kind: AbiFunctionKind;
    /**
     * List of modifiers affecting the function.
     */
    modifiers?: AbiFunctionModifier[];
    name: string;
    /**
     * Type identifiers of the function parameters.
     */
    params?: AbiParameters;
    /**
     * Return type identifier.
     */
    result?: AbiType | null;
}
/**
 * A JSON Schema object.
 */
export interface SchemaObject {
    /**
     * The `$id` keyword.
     *
     * See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).
     */
    $id?: string | null;
    /**
     * The `$ref` keyword.
     *
     * See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).
     */
    $ref?: string | null;
    /**
     * The `additionalItems` keyword.
     *
     * See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).
     */
    additionalItems?: Schema | null;
    /**
     * The `additionalProperties` keyword.
     *
     * See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).
     */
    additionalProperties?: Schema | null;
    /**
     * The `allOf` keyword.
     *
     * See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).
     */
    allOf?: Schema[] | null;
    /**
     * The `anyOf` keyword.
     *
     * See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).
     */
    anyOf?: Schema[] | null;
    /**
     * The `const` keyword.
     *
     * See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)
     */
    const?: {
        [k: string]: unknown;
    };
    /**
     * The `contains` keyword.
     *
     * See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).
     */
    contains?: Schema | null;
    /**
     * The `default` keyword.
     *
     * See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).
     */
    default?:
        | string
        | number
        | boolean
        | {
              [key: string]: string | number | boolean;
          }
        | undefined;
    /**
     * The `deprecated` keyword.
     *
     * See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).
     */
    deprecated?: boolean;
    /**
     * The `description` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    description?: string | null;
    /**
     * The `else` keyword.
     *
     * See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).
     */
    else?: Schema | null;
    /**
     * The `enum` keyword.
     *
     * See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)
     */
    enum?: (string | number | boolean)[] | null;
    /**
     * The `examples` keyword.
     *
     * See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).
     */
    examples?: true[];
    /**
     * The `exclusiveMaximum` keyword.
     *
     * See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).
     */
    exclusiveMaximum?: number | null;
    /**
     * The `exclusiveMinimum` keyword.
     *
     * See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).
     */
    exclusiveMinimum?: number | null;
    /**
     * The `format` keyword.
     *
     * See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).
     */
    format?: string | null;
    /**
     * The `if` keyword.
     *
     * See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).
     */
    if?: Schema | null;
    /**
     * The `items` keyword.
     *
     * See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).
     */
    items?: SingleOrVecFor_Schema | null;
    /**
     * The `maxItems` keyword.
     *
     * See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).
     */
    maxItems?: number | null;
    /**
     * The `maxLength` keyword.
     *
     * See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).
     */
    maxLength?: number | null;
    /**
     * The `maxProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).
     */
    maxProperties?: number | null;
    /**
     * The `maximum` keyword.
     *
     * See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).
     */
    maximum?: number | null;
    /**
     * The `minItems` keyword.
     *
     * See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).
     */
    minItems?: number | null;
    /**
     * The `minLength` keyword.
     *
     * See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).
     */
    minLength?: number | null;
    /**
     * The `minProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).
     */
    minProperties?: number | null;
    /**
     * The `minimum` keyword.
     *
     * See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).
     */
    minimum?: number | null;
    /**
     * The `multipleOf` keyword.
     *
     * See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).
     */
    multipleOf?: number | null;
    /**
     * The `not` keyword.
     *
     * See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).
     */
    not?: Schema | null;
    /**
     * The `oneOf` keyword.
     *
     * See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).
     */
    oneOf?: Schema[] | null;
    /**
     * The `pattern` keyword.
     *
     * See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).
     */
    pattern?: string | null;
    /**
     * The `patternProperties` keyword.
     *
     * See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).
     */
    patternProperties?: {
        [k: string]: Schema;
    };
    /**
     * The `properties` keyword.
     *
     * See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).
     */
    properties?: {
        [k: string]: Schema;
    };
    /**
     * The `propertyNames` keyword.
     *
     * See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).
     */
    propertyNames?: Schema | null;
    /**
     * The `readOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    readOnly?: boolean;
    /**
     * The `required` keyword.
     *
     * See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).
     */
    required?: string[];
    /**
     * The `then` keyword.
     *
     * See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).
     */
    then?: Schema | null;
    /**
     * The `title` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    title?: string | null;
    /**
     * The `type` keyword.
     *
     * See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
     */
    type?: SingleOrVecFor_InstanceType | null;
    /**
     * The `uniqueItems` keyword.
     *
     * See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).
     */
    uniqueItems?: boolean | null;
    /**
     * The `writeOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    writeOnly?: boolean;
    [k: string]: unknown;
}
/**
 * Information about a single named JSON function parameter.
 */
export interface AbiJsonParameter {
    /**
     * Parameter name (e.g. `p1` in `fn foo(p1: u32) {}`).
     */
    name: string;
    /**
     * JSON Subschema that represents this type (can be an inline primitive, a reference to the root schema and a few other corner-case things).
     */
    type_schema: Schema;
}
/**
 * Information about a single named Borsh function parameter.
 */
export interface AbiBorshParameter {
    /**
     * Parameter name (e.g. `p1` in `fn foo(p1: u32) {}`).
     */
    name: string;
    /**
     * Inline Borsh schema that represents this type.
     */
    type_schema: {
        [k: string]: unknown;
    };
}
/**
 * The root object of a JSON Schema document.
 */
export interface RootSchema {
    /**
     * The `$id` keyword.
     *
     * See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).
     */
    $id?: string | null;
    /**
     * The `$ref` keyword.
     *
     * See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).
     */
    $ref?: string | null;
    /**
     * The `$schema` keyword.
     *
     * See [JSON Schema 8.1.1. The "$schema" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.1.1).
     */
    $schema?: string | null;
    /**
     * The `additionalItems` keyword.
     *
     * See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).
     */
    additionalItems?: Schema | null;
    /**
     * The `additionalProperties` keyword.
     *
     * See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).
     */
    additionalProperties?: Schema | null;
    /**
     * The `allOf` keyword.
     *
     * See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).
     */
    allOf?: Schema[] | null;
    /**
     * The `anyOf` keyword.
     *
     * See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).
     */
    anyOf?: Schema[] | null;
    /**
     * The `const` keyword.
     *
     * See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)
     */
    const?: {
        [k: string]: unknown;
    };
    /**
     * The `contains` keyword.
     *
     * See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).
     */
    contains?: Schema | null;
    /**
     * The `default` keyword.
     *
     * See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).
     */
    default?: {
        [k: string]: unknown;
    };
    /**
     * The `definitions` keyword.
     *
     * In JSON Schema draft 2019-09 this was replaced by $defs, but in Schemars this is still serialized as `definitions` for backward-compatibility.
     *
     * See [JSON Schema 8.2.5. Schema Re-Use With "$defs"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.5), and [JSON Schema (draft 07) 9. Schema Re-Use With "definitions"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9).
     */
    definitions?: {
        [k: string]: Schema;
    };
    /**
     * The `deprecated` keyword.
     *
     * See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).
     */
    deprecated?: boolean;
    /**
     * The `description` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    description?: string | null;
    /**
     * The `else` keyword.
     *
     * See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).
     */
    else?: Schema | null;
    /**
     * The `enum` keyword.
     *
     * See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)
     */
    enum?: true[] | null;
    /**
     * The `examples` keyword.
     *
     * See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).
     */
    examples?: true[];
    /**
     * The `exclusiveMaximum` keyword.
     *
     * See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).
     */
    exclusiveMaximum?: number | null;
    /**
     * The `exclusiveMinimum` keyword.
     *
     * See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).
     */
    exclusiveMinimum?: number | null;
    /**
     * The `format` keyword.
     *
     * See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).
     */
    format?: string | null;
    /**
     * The `if` keyword.
     *
     * See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).
     */
    if?: Schema | null;
    /**
     * The `items` keyword.
     *
     * See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).
     */
    items?: SingleOrVecFor_Schema | null;
    /**
     * The `maxItems` keyword.
     *
     * See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).
     */
    maxItems?: number | null;
    /**
     * The `maxLength` keyword.
     *
     * See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).
     */
    maxLength?: number | null;
    /**
     * The `maxProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).
     */
    maxProperties?: number | null;
    /**
     * The `maximum` keyword.
     *
     * See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).
     */
    maximum?: number | null;
    /**
     * The `minItems` keyword.
     *
     * See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).
     */
    minItems?: number | null;
    /**
     * The `minLength` keyword.
     *
     * See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).
     */
    minLength?: number | null;
    /**
     * The `minProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).
     */
    minProperties?: number | null;
    /**
     * The `minimum` keyword.
     *
     * See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).
     */
    minimum?: number | null;
    /**
     * The `multipleOf` keyword.
     *
     * See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).
     */
    multipleOf?: number | null;
    /**
     * The `not` keyword.
     *
     * See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).
     */
    not?: Schema | null;
    /**
     * The `oneOf` keyword.
     *
     * See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).
     */
    oneOf?: Schema[] | null;
    /**
     * The `pattern` keyword.
     *
     * See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).
     */
    pattern?: string | null;
    /**
     * The `patternProperties` keyword.
     *
     * See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).
     */
    patternProperties?: {
        [k: string]: Schema;
    };
    /**
     * The `properties` keyword.
     *
     * See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).
     */
    properties?: {
        [k: string]: Schema;
    };
    /**
     * The `propertyNames` keyword.
     *
     * See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).
     */
    propertyNames?: Schema | null;
    /**
     * The `readOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    readOnly?: boolean;
    /**
     * The `required` keyword.
     *
     * See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).
     */
    required?: string[];
    /**
     * The `then` keyword.
     *
     * See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).
     */
    then?: Schema | null;
    /**
     * The `title` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    title?: string | null;
    /**
     * The `type` keyword.
     *
     * See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
     */
    type?: SingleOrVecFor_InstanceType | null;
    /**
     * The `uniqueItems` keyword.
     *
     * See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).
     */
    uniqueItems?: boolean | null;
    /**
     * The `writeOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    writeOnly?: boolean;
    [k: string]: unknown;
}
export interface AbiMetadata {
    /**
     * The authors of the smart contract.
     */
    authors?: string[];
    /**
     * The information about how this contract was built.
     */
    build?: BuildInfo | null;
    /**
     * The name of the smart contract.
     */
    name?: string | null;
    /**
     * The version of the smart contract.
     */
    version?: string | null;
    /**
     * The SHA-256 hash of the contract WASM code in Base58 format.
     */
    wasm_hash?: string | null;
    [k: string]: unknown;
}
export interface BuildInfo {
    /**
     * The build tool (versioned) that was used to build the contract.
     */
    builder: string;
    /**
     * The compiler (versioned) that was used to build the contract.
     */
    compiler: string;
    /**
     * The docker image (versioned) where the contract was built.
     */
    image?: string | null;
    [k: string]: unknown;
}
