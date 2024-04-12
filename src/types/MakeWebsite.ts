import type { TaskProgress } from '@promptbook/types';
import type { Task, TaskId } from './Task';
import type  { Language } from './Language';

export type MakeWebsiteTask = Task<MakeWebsiteOptions, MakeWebsiteProgress>;

export type MakeWebsiteOptions = {
    id?: TaskId;
    language: Language;
    assignment: string;
};

export type MakeWebsiteResult = {
    url: string;
};

export type MakeWebsiteProgress = TaskProgress;

/**
 * TODO: !!! Make real types for website making
 * TODO: !!! Annotate all
 */
