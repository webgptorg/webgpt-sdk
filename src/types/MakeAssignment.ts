import type { Language } from './Language';
import type { Task } from './Task';
import type { TaskId } from './type-aliases';

export type MakeAssignmentTask = Task<MakeAssignmentResult, MakeAssignmentProgress>;

export type MakeAssignmentOptions = {
    id?: TaskId;
    language: Language;
    idea: string;
};

export type MakeAssignmentResult = {
    status: 'SUCCESS';
    assignment: string;
    message: string;
};

export type MakeAssignmentProgress = {
    status: 'RUNNING';
    message: string;
};

/**
 * TODO: !!! Make real types for assignment making
 * TODO: !!! Annotate all
 */
