/**
 * This error indicates that idea is not good enough to be accepted.
 */
export class IdeaNotAccepted extends Error {
    public readonly name = 'NotFoundError';
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IdeaNotAccepted.prototype);
    }
}
