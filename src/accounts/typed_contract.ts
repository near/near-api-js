/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-unused-vars */

import validator from 'is-my-json-valid';
import type { Provider } from '../providers/index.js';
import type { BlockReference, TxExecutionStatus } from '../types/index.js';
import type {
    AbiFunction,
    AbiFunctionKind,
    AbiParameters,
    AbiRoot,
    AbiType,
    RootSchema,
    Schema,
    SchemaObject,
} from './abi_types.js';
import type { Account } from './account.js';
import { ArgumentSchemaError, UnknownArgumentError } from './errors.js';

type IsNullable<T> = [null] extends [T] ? true : false;

type IsNever<T> = [T] extends [never] ? true : false;

export type IsNarrowable<T, U> = IsNever<(T extends U ? true : false) & (U extends T ? false : true)> extends true
    ? false
    : true;

type IsFullyOptional<T> = IsNever<keyof T> extends true
    ? true
    : {
            [K in keyof T]-?: {} extends Pick<T, K> ? true : false;
        }[keyof T] extends true
      ? true
      : false;

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type ExtractAbiFunctions<
    abi extends AbiRoot,
    abiFunctionKind extends AbiFunctionKind = AbiFunctionKind,
    _functions extends AbiFunction[] = abi['body']['functions'],
> = Extract<_functions[number], { kind: abiFunctionKind }>;

type ExtractAbiFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi>,
    abiFunctionKind extends AbiFunctionKind = AbiFunctionKind,
> = Extract<ExtractAbiFunctions<abi, abiFunctionKind>, { name: functionName }>;

type ExtractAbiFunctionNames<
    abi extends AbiRoot,
    abiFunctionKind extends AbiFunctionKind = AbiFunctionKind,
    _functions extends AbiFunction[] = abi['body']['functions'],
> = ExtractAbiFunctions<abi, abiFunctionKind>['name'];

type GetViewFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi, 'view'>,
    abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>,
    _args extends Record<string, unknown> = ContractFunctionArgs<abi, abiFunction>,
    _return = ContractFunctionReturnType<abi, abiFunction>,
> = IsNarrowable<abi, AbiRoot> extends true
    ? IsNever<_args> extends true
        ? (params?: { blockQuery?: BlockReference }) => Promise<Prettify<_return>>
        : IsFullyOptional<_args> extends true
          ? (params?: { blockQuery?: BlockReference; args?: _args }) => Promise<Prettify<_return>>
          : (params: { blockQuery?: BlockReference; args: _args }) => Promise<Prettify<_return>>
    : <Response = unknown>(params?: {
          blockQuery?: BlockReference;
          args?: Record<string, unknown>;
      }) => Promise<Response>;

type GetCallFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi, 'call'>,
    abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>,
    _args extends Record<string, unknown> = ContractFunctionArgs<abi, abiFunction>,
    _return = ContractFunctionReturnType<abi, abiFunction>,
> = IsNarrowable<abi, AbiRoot> extends true
    ? IsNever<_args> extends true
        ? (params: {
              deposit?: bigint;
              gas?: bigint;
              waitUntil?: TxExecutionStatus;
              account: Account;
          }) => Promise<Prettify<_return>>
        : (params: {
              deposit?: bigint;
              gas?: bigint;
              args: _args;
              waitUntil?: TxExecutionStatus;
              account: Account;
          }) => Promise<Prettify<_return>>
    : <Response = unknown>(params: {
          deposit?: bigint;
          gas?: bigint;
          args?: Record<string, unknown>;
          waitUntil?: TxExecutionStatus;
          account: Account;
      }) => Promise<Response>;

type ContractFunctionReturnType<abi extends AbiRoot, abiFunction extends AbiFunction> = abiFunction extends {
    result: infer Result;
}
    ? Result extends AbiType
        ? Result['type_schema'] extends Schema
            ? ResolveSchemaType<abi, Result['type_schema']>
            : unknown
        : unknown
    : void;

type ContractFunctionArgs<abi extends AbiRoot, abiFunction extends AbiFunction> = abiFunction extends {
    params: infer Params;
}
    ? Params extends AbiParameters
        ? Params['args'] extends { name: any; type_schema: any }[]
            ? Prettify<
                  {
                      [Arg in Params['args'][number] as IsNullable<
                          ResolveSchemaType<abi, Arg['type_schema']>
                      > extends false
                          ? Arg['name'] & string
                          : never]: ResolveSchemaType<abi, Arg['type_schema']>;
                  } & {
                      [Arg in Params['args'][number] as IsNullable<
                          ResolveSchemaType<abi, Arg['type_schema']>
                      > extends true
                          ? Arg['name'] & string
                          : never]?: ResolveSchemaType<abi, Arg['type_schema']>;
                  }
              >
            : never
        : never
    : never;

type ToArray<T> = T extends any[] ? T : [T];

type JSONSchemaTypeMap = {
    string: string;
    integer: number;
    number: number;
    boolean: boolean;
    null: null;
};

type EnumValue = NonNullable<SchemaObject['enum']>;

type ResolveEnum<schema extends { enum: EnumValue }> = schema['enum'] extends (infer S)[] ? S : never;

type ResolveType<
    abi extends AbiRoot,
    schema extends Schema,
    type extends any | any[],
> = ToArray<type> extends (infer T)[]
    ? T extends 'array'
        ? ResolveArrayType<abi, schema>
        : T extends 'object'
          ? ResolveObjectType<abi, schema>
          : T extends keyof JSONSchemaTypeMap
            ? JSONSchemaTypeMap[T]
            : never
    : never;

type ResolveArrayType<abi extends AbiRoot, schema extends Schema> = schema extends {
    items: infer Items;
}
    ? Items extends Schema
        ? schema extends {
              uniqueItems: true;
          }
            ? Set<ResolveSchemaType<abi, Items>>
            : ResolveSchemaType<abi, Items>[]
        : unknown[]
    : unknown[];

type ResolveObjectType<abi extends AbiRoot, schema extends Schema> = schema extends {
    properties: Record<string, any>;
}
    ? schema extends {
          required: string[];
      }
        ? Prettify<
              {
                  -readonly [Key in keyof schema['properties'] as Key extends schema['required'][number]
                      ? Key
                      : never]: ResolveSchemaType<abi, schema['properties'][Key]>;
              } & {
                  -readonly [Key in keyof schema['properties'] as Key extends schema['required'][number]
                      ? never
                      : Key]?: ResolveSchemaType<abi, schema['properties'][Key]>;
              }
          >
        : {
              -readonly [Key in keyof schema['properties']]?: ResolveSchemaType<abi, schema['properties'][Key]>;
          }
    : schema extends {
            additionalProperties: Schema;
        }
      ? Record<string, ResolveSchemaType<abi, schema['additionalProperties']>>
      : Record<string, unknown>;

type ResolveRef<
    abi extends AbiRoot,
    ref extends string,
    _definitions = abi['body']['root_schema']['definitions'],
> = ref extends keyof _definitions
    ? _definitions[ref] extends Schema
        ? ResolveSchemaType<abi, _definitions[ref]>
        : never
    : never;

/** @todo: it has to use advanced OneOf type that ensures only exact type is allowed */
type ResolveOneOf<abi extends AbiRoot, schema extends { oneOf: Schema[] }> = schema['oneOf'] extends (infer S)[]
    ? S extends Schema
        ? ResolveSchemaType<abi, S>
        : never
    : never;

type ResolveAnyOf<abi extends AbiRoot, schema extends { anyOf: Schema[] }> = schema['anyOf'] extends (infer S)[]
    ? S extends Schema
        ? ResolveSchemaType<abi, S>
        : never
    : never;

type ResolveSchemaType<abi extends AbiRoot, schema extends Schema | boolean> = schema extends boolean
    ? schema
    : schema extends { enum: EnumValue }
      ? ResolveEnum<schema>
      : schema extends { type: infer Type }
        ? ResolveType<abi, schema, Type>
        : schema extends { $ref: `#/definitions/${infer Ref}` }
          ? ResolveRef<abi, Ref>
          : schema extends { oneOf: Schema[] }
            ? ResolveOneOf<abi, schema>
            : schema extends { anyOf: Schema[] }
              ? ResolveAnyOf<abi, schema>
              : never;

type ContractParameters<abi extends AbiRoot, contractId extends string> = {
    contractId: contractId;
    provider: Provider;
    abi: abi;
};

export type ContractReturnType<
    abi extends AbiRoot,
    contractId extends string,
    //
    _viewFunctionNames extends string = abi extends AbiRoot
        ? AbiRoot extends abi
            ? string
            : ExtractAbiFunctionNames<abi, 'view'>
        : string,
    _callFunctionNames extends string = abi extends AbiRoot
        ? AbiRoot extends abi
            ? string
            : ExtractAbiFunctionNames<abi, 'call'>
        : string,
> = Prettify<
    (IsNever<_viewFunctionNames> extends false
        ? {
              view: {
                  [functionName in _viewFunctionNames]: GetViewFunction<abi, functionName>;
              };
          }
        : {}) &
        (IsNever<_callFunctionNames> extends false
            ? {
                  call: {
                      [functionName in _callFunctionNames]: GetCallFunction<abi, functionName>;
                  };
              }
            : {}) & { abi: abi; contractId: contractId }
>;

export type ContractConstructor = {
    new <const abi extends AbiRoot, contractId extends string>(
        params: ContractParameters<abi, contractId>
    ): ContractReturnType<abi, contractId>;

    new <const abi extends AbiRoot, contractId extends string>(
        params: Prettify<Omit<ContractParameters<abi, contractId>, 'abi'>>
    ): Prettify<Omit<ContractReturnType<abi, contractId>, 'abi'>>;
};

class Contract<const abi extends AbiRoot, contractId extends string> {
    abi?: abi;
    contractId: contractId;

    view!: ContractReturnType<abi, contractId> extends {
        view: infer ViewMethods;
    }
        ? ViewMethods
        : never;

    call!: ContractReturnType<abi, contractId> extends {
        call: infer CallMethods;
    }
        ? CallMethods
        : never;

    constructor({ abi, provider, contractId }: ContractParameters<abi, contractId>) {
        this.contractId = contractId;
        this.abi = abi;

        let hasViewFunction = false;
        let hasCallFunction = false;

        const abiFunctions = abi?.body.functions || [];

        for (const func of abiFunctions) {
            if (func.kind === 'view') {
                hasViewFunction = true;
            } else if (func.kind === 'call') {
                hasCallFunction = true;
            }

            // exit early if all flags are `true`
            if (hasViewFunction && hasCallFunction) break;
        }

        if (hasViewFunction || !abi) {
            this.view = new Proxy(
                {},
                {
                    get: (_, functionName: string) => {
                        const abiFunction = (abi?.body.functions || []).find(({ name }) => name === functionName);

                        return async (params: { args?: object; blockQuery?: BlockReference } = {}) => {
                            const args = params.args ?? {};

                            if (abiFunction && abi) {
                                validateArguments(args, abiFunction, abi);
                            }

                            return provider.callFunction(
                                contractId,
                                functionName,
                                args as Record<string, unknown>,
                                params.blockQuery
                            );
                        };
                    },
                }
            ) as any;
        }

        if (hasCallFunction || !abi) {
            this.call = new Proxy(
                {},
                {
                    get: (_, functionName: string) => {
                        const abiFunction = (abi?.body.functions || []).find(({ name }) => name === functionName);

                        return async (params: {
                            deposit?: bigint;
                            gas?: bigint;
                            args?: object;
                            waitUntil?: TxExecutionStatus;
                            account: Account;
                        }) => {
                            const args = params.args ?? {};

                            if (abiFunction && abi) {
                                validateArguments(args, abiFunction, abi);
                            }

                            return params.account.callFunction({
                                contractId,
                                methodName: functionName,
                                args,
                                deposit: params.deposit,
                                gas: params.gas,
                                waitUntil: params.waitUntil,
                            });
                        };
                    },
                }
            ) as any;
        }

        if (!abi) {
            delete this.abi;
        }
    }
}

export const TypedContract = Contract as ContractConstructor;

function validateArguments(args: object, abiFunction: AbiFunction, abiRoot: AbiRoot) {
    if (typeof args !== 'object' || typeof abiFunction.params !== 'object') return;

    if (abiFunction.params.serialization_type === 'json') {
        const params = abiFunction.params.args;
        for (const p of params) {
            const arg = args[p.name];
            const typeSchema = p.type_schema;
            (typeSchema as RootSchema).definitions = abiRoot.body.root_schema.definitions;
            const validate = validator(typeSchema as any);
            const valid = validate(arg);
            if (!valid) {
                throw new ArgumentSchemaError(p.name, validate.errors);
            }
        }
        // Check there are no extra unknown arguments passed
        for (const argName of Object.keys(args)) {
            const param = params.find((p) => p.name === argName);
            if (!param) {
                throw new UnknownArgumentError(
                    argName,
                    params.map((p) => p.name)
                );
            }
        }
    }
}
