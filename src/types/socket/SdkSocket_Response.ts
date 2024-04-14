import type { MakeAssignmentResult } from '../MakeAssignment';
import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client when the task is succesfully completed
 */
export type SdkSocket_Response = SdkSocket_Abstract & {
    readonly type: 'RESPONSE';
} & (
        | {
              taskName: 'MAKE_ASSIGNMENT';
              result: MakeAssignmentResult;
          }
        | {
              taskName: 'MAKE_WEBSITE';
              result: MakeAssignmentResult;
          }
    );
