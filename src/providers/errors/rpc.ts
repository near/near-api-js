export class RpcError extends Error {
    public override readonly name = this.constructor.name;
}
