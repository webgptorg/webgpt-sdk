import type { MakeAssignmentProgress } from '../MakeAssignment';
import type { MakeWebsiteProgress } from '../MakeWebsite';
import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client arbitrarily and may be sent multiple times
 */
export type SdkSocket_Progress = SdkSocket_Abstract & {
    /**
     * The type of the request
     */
    readonly type: 'PROGRESS';

    /**
     * Technical message in english
     */
    readonly message: string;
} & (
        | ({
              /**
               * The name of the task
               */
              readonly taskName: 'MAKE_ASSIGNMENT';
          } & MakeAssignmentProgress)
        | ({
              /**
               * The name of the task
               */
              readonly taskName: 'MAKE_WEBSITE';
          } & MakeWebsiteProgress)
    );
