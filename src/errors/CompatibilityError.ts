/**
 * This error indicates SDK is not compatible with the remote server.
 */
export class CompatibilityError extends Error {
    public readonly name = 'CompatibilityError';
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CompatibilityError.prototype);
    }
}
