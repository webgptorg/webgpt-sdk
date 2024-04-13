import type { Language } from './Language';
import type { Task, TaskId } from './Task';

export type MakeAssignmentTask = Task<MakeAssignmentResult, MakeAssignmentProgress>;

export type MakeAssignmentOptions = {
    id?: TaskId;
    language: Language;
    idea: string;
};

export type MakeAssignmentResult = {
    status: 'SUCCESS';
    message: string;
    assignment: string;
};

export type MakeAssignmentProgress = {
    status: 'RUNNING';
    message: string;
};

/**
 * TODO: !!! Make real types for assignment making
 * TODO: !!! Annotate all
 */
