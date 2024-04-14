import type { BehaviorSubject } from 'rxjs';

/**
 * !!!
 *
 * Note: There is also `internalId` in the SDK, but it is not exposed to the consumer; this is `externalId` in the database
 */
export type TaskId = string;

export type Task<TResult, TProgress> = {
    id: TaskId;
    asPromise(): Promise<TResult>;
    asObservable(): BehaviorSubject<TResult | TProgress>;
};

/**
 * TODO: !!! Annotate all
 */
