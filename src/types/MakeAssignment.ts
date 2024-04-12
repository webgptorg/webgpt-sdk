import type { TaskProgress } from '@promptbook/types';
import type { Task, TaskId } from './Task';

export type MakeAssignmentTask = Task<MakeAssignmentResult, MakeAssignmentProgress>;

export type MakeAssignmentOptions = {
    id?: TaskId;
    idea: string;
};

export type MakeAssignmentResult = {
    assignment: string;
};

export type MakeAssignmentProgress = TaskProgress;

/**
 * TODO: !!! Annotate all
 */
