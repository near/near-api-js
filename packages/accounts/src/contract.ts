import type {
    AbiFunction,
    AbiFunctionKind,
    AbiParameters,
    AbiRoot,
    Schema,
    AbiType,
} from "./abi_types";
import { Provider } from "@near-js/providers";
import { Account } from "./account";

import { BlockReference, TxExecutionStatus } from "@near-js/types";

type IsNullable<T> = [null] extends [T] ? true : false;

type IsNever<T> = [T] extends [never] ? true : false;

export type IsNarrowable<T, U> = IsNever<
    (T extends U ? true : false) & (U extends T ? false : true)
> extends true
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
    _functions extends AbiFunction[] = abi["body"]["functions"]
> = Extract<_functions[number], { kind: abiFunctionKind }>;

type ExtractAbiFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi>,
    abiFunctionKind extends AbiFunctionKind = AbiFunctionKind
> = Extract<ExtractAbiFunctions<abi, abiFunctionKind>, { name: functionName }>;

type ExtractAbiFunctionNames<
    abi extends AbiRoot,
    abiFunctionKind extends AbiFunctionKind = AbiFunctionKind,
    _functions extends AbiFunction[] = abi["body"]["functions"]
> = ExtractAbiFunctions<abi, abiFunctionKind>["name"];

type GetViewFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi, "view">,
    abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>,
    _args extends Record<string, unknown> = ContractFunctionArgs<
        abi,
        abiFunction
    >,
    _return extends unknown = ContractFunctionReturnType<abi, abiFunction>
> = IsNarrowable<abi, AbiRoot> extends true
    ? IsNever<_args> extends true
        ? (params?: {
              blockQuery?: BlockReference;
          }) => Promise<Prettify<_return>>
        : IsFullyOptional<_args> extends true
        ? (params?: {
              blockQuery?: BlockReference;
              args?: _args;
          }) => Promise<Prettify<_return>>
        : (params: {
              blockQuery?: BlockReference;
              args: _args;
          }) => Promise<Prettify<_return>>
    : <Response extends unknown = unknown>(params: {
          blockQuery?: BlockReference;
          args: Record<string, unknown>;
      }) => Promise<Response>;

type GetCallFunction<
    abi extends AbiRoot,
    functionName extends ExtractAbiFunctionNames<abi, "call">,
    abiFunction extends AbiFunction = ExtractAbiFunction<abi, functionName>,
    _args extends Record<string, unknown> = ContractFunctionArgs<
        abi,
        abiFunction
    >,
    _return extends unknown = ContractFunctionReturnType<abi, abiFunction>
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
    : <Response extends unknown = unknown>(params: {
          deposit?: bigint;
          gas?: bigint;
          args: Record<string, unknown>;
          waitUntil?: TxExecutionStatus;
          account: Account;
      }) => Promise<Response>;

type ContractFunctionReturnType<
    abi extends AbiRoot,
    abiFunction extends AbiFunction
> = abiFunction extends { result: infer Result }
    ? Result extends AbiType
        ? Result["type_schema"] extends Schema
            ? ResolveSchemaType<abi, Result["type_schema"]>
            : unknown
        : unknown
    : void;

type ContractFunctionArgs<
    abi extends AbiRoot,
    abiFunction extends AbiFunction
> = abiFunction extends { params: infer Params }
    ? Params extends AbiParameters
        ? Params["args"] extends { name: infer N; type_schema: infer S }[]
            ? Prettify<
                  {
                      [Arg in Params["args"][number] as IsNullable<
                          ResolveSchemaType<abi, Arg["type_schema"]>
                      > extends false
                          ? Arg["name"] & string
                          : never]: ResolveSchemaType<abi, Arg["type_schema"]>;
                  } & {
                      [Arg in Params["args"][number] as IsNullable<
                          ResolveSchemaType<abi, Arg["type_schema"]>
                      > extends true
                          ? Arg["name"] & string
                          : never]?: ResolveSchemaType<abi, Arg["type_schema"]>;
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

type ResolveType<
    abi extends AbiRoot,
    schema extends Schema,
    type extends any | any[]
> = ToArray<type> extends (infer T)[]
    ? T extends "array"
        ? ResolveArrayType<abi, schema>
        : T extends "object"
        ? ResolveObjectType<abi, schema>
        : T extends keyof JSONSchemaTypeMap
        ? JSONSchemaTypeMap[T]
        : never
    : never;

type ResolveArrayType<
    abi extends AbiRoot,
    schema extends Schema
> = schema extends {
    items: infer Items;
}
    ? Items extends Schema
        ? ResolveSchemaType<abi, Items>[]
        : unknown[]
    : unknown[];

type ResolveObjectType<
    abi extends AbiRoot,
    schema extends Schema
> = schema extends {
    properties: Record<string, any>;
}
    ? schema extends {
          required: string[];
      }
        ? Prettify<
              {
                  -readonly [Key in keyof schema["properties"] as Key extends schema["required"][number]
                      ? Key
                      : never]: ResolveSchemaType<
                      abi,
                      schema["properties"][Key]
                  >;
              } & {
                  -readonly [Key in keyof schema["properties"] as Key extends schema["required"][number]
                      ? never
                      : Key]?: ResolveSchemaType<
                      abi,
                      schema["properties"][Key]
                  >;
              }
          >
        : {
              -readonly [Key in keyof schema["properties"]]?: ResolveSchemaType<
                  abi,
                  schema["properties"][Key]
              >;
          }
    : Record<string, unknown>;

type ResolveRef<
    abi extends AbiRoot,
    ref extends string,
    _definitions = abi["body"]["root_schema"]["definitions"]
> = ref extends keyof _definitions
    ? _definitions[ref] extends Schema
        ? ResolveSchemaType<abi, _definitions[ref]>
        : never
    : never;

type ResolveOneOf<
    abi extends AbiRoot,
    schema extends { oneOf: Schema[] }
> = schema["oneOf"] extends (infer S)[]
    ? S extends Schema
        ? ResolveSchemaType<abi, S>
        : never
    : never;

type ResolveAnyOf<
    abi extends AbiRoot,
    schema extends { anyOf: Schema[] }
> = schema["anyOf"] extends (infer S)[]
    ? S extends Schema
        ? ResolveSchemaType<abi, S>
        : never
    : never;

type ResolveSchemaType<
    abi extends AbiRoot,
    schema extends Schema | boolean
> = schema extends boolean
    ? schema
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
            : ExtractAbiFunctionNames<abi, "view">
        : string,
    _callFunctionNames extends string = abi extends AbiRoot
        ? AbiRoot extends abi
            ? string
            : ExtractAbiFunctionNames<abi, "call">
        : string
> = Prettify<
    (IsNever<_viewFunctionNames> extends false
        ? {
              view: {
                  [functionName in _viewFunctionNames]: GetViewFunction<
                      abi,
                      functionName
                  >;
              };
          }
        : {}) &
        (IsNever<_callFunctionNames> extends false
            ? {
                  call: {
                      [functionName in _callFunctionNames]: GetCallFunction<
                          abi,
                          functionName
                      >;
                  };
              }
            : {}) & { abi: abi; contractId: contractId }
>;

export type ContractConstructor = {
    new <const abi extends AbiRoot, contractId extends string>(
        params: ContractParameters<abi, contractId>
    ): ContractReturnType<abi, contractId>;

    new <const abi extends AbiRoot, contractId extends string>(
        params: Prettify<Omit<ContractParameters<abi, contractId>, "abi">>
    ): Prettify<Omit<ContractReturnType<abi, contractId>, "abi">>;
};

class TypedContract<const abi extends AbiRoot, contractId extends string> {
    abi?: abi;
    contractId: contractId;

    view: ContractReturnType<abi, contractId> extends {
        view: infer ViewMethods;
    }
        ? ViewMethods
        : never;

    call: ContractReturnType<abi, contractId> extends {
        call: infer CallMethods;
    }
        ? CallMethods
        : never;

    constructor({
        abi,
        provider,
        contractId,
    }: ContractParameters<abi, contractId>) {
        this.contractId = contractId;
        this.abi = abi;

        let hasViewFunction = false;
        let hasCallFunction = false;

        const abiFunctions = abi?.body.functions || [];

        for (const func of abiFunctions) {
            if (func.kind === "view") {
                hasViewFunction = true;
            } else if (func.kind === "call") {
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
                        return (
                            params: {
                                args?: object;
                                blockQuery?: BlockReference;
                            } = {}
                        ) => {
                            const args = params.args ?? {};

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
                        return (params: {
                            deposit?: bigint;
                            gas?: bigint;
                            args?: object;
                            waitUntil?: TxExecutionStatus;
                            account: Account;
                        }) => {
                            const args = params.args ?? {};

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

export const Contract = TypedContract as ContractConstructor;