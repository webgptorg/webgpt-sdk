import type { BehaviorSubject } from 'rxjs';



export type Task<TResult, TProgress> = {
    id: TaskId;
    asPromise(): Promise<TResult>;
    asObservable(): BehaviorSubject<TResult | TProgress>;
};

/**
 * TODO: !!! Annotate all
 */
