/**
 * This error should never happen.
 * If it happens, it's a bug in the SDK.
 */
export class UnexpectedError extends Error {
    public readonly name = 'UnexpectedError';
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, UnexpectedError.prototype);
    }
}
