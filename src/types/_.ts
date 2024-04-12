import type { Subject } from 'rxjs';

export type TaskId = string;

export type Task<TResult, TProgress> = {
    id: TaskId;
    asPromise(): Promise<TResult>;
    asSubject(): Subject<TResult | TProgress>;
};







/**
 * TODO: !!! Annotate all
 * TODO: !!! Split into files
 */
