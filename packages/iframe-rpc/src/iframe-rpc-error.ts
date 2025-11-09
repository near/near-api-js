export class IFrameRPCError extends Error {
    constructor(
        override readonly message: string,
        public readonly code: number,
    ) {
        super(`Error #${code}: ${message}`);
    }

    public toResponseError() {
        return {
            code: this.code,
            message: this.message,
        };
    }
}
