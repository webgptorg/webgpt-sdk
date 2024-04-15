/**
 * This error indicates SDK can not communicate with the remote server.
 */
export class TimeoutError extends Error {
    public readonly name = 'TimeoutError';
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
