import type { Language } from './Language';
import type { Task } from './Task';
import type { TaskId } from './type-aliases';

export type MakeWebsiteTask = Task<MakeWebsiteOptions, MakeWebsiteProgress>;

export type MakeWebsiteOptions = {
    id?: TaskId;
    language: Language;
    assignment: string;
};

export type MakeWebsiteResult = {
    status: 'SUCCESS';
    url: string;
    message: string;
};

export type MakeWebsiteProgress = {
    status: 'RUNNING';
    message: string;
};

/**
 * TODO: !!! Make real types for website making
 * TODO: !!! Annotate all
 */
