import type { TaskProgress } from "@promptbook/types";
import type { Task } from "./_";

export type MakeAssignmentTask = Task<MakeAssignmentResult, MakeAssignmentProgress>;



export type MakeAssignmentOptions = {
  idea: string
}



export type MakeAssignmentResult = {
assignment: string
}




export type MakeAssignmentProgress = TaskProgress





/**
 * TODO: !!! Annotate all
 */
