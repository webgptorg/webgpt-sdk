/**
 * This error indicates that task which you try to recover does not exist.
 */
export class NotFoundError extends Error {
    public readonly name = 'NotFoundError';
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
