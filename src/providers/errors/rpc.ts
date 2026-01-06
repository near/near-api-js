export class RpcError extends Error {
    public override readonly name = this.constructor.name;
}

export class InternalRpcError extends RpcError {}
