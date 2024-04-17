import type { BehaviorSubject } from 'rxjs';
import type { TaskId } from './type-aliases';

export type Task<TResult, TProgress> = {
    id: TaskId;
    asPromise(): Promise<TResult>;
    asObservable(): BehaviorSubject<TResult | TProgress>;
};

/**
 * TODO: !!! Annotate all
 */
