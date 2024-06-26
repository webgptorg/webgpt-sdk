import type { MakeAssignmentResult } from '../MakeAssignment';
import type { MakeWebsiteResult } from '../MakeWebsite';
import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client when the task is succesfully completed
 */
export type SdkSocket_Response = SdkSocket_Abstract & {
    /**
     * The type of the request
     */
    readonly type: 'RESPONSE';

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
          } & MakeAssignmentResult)
        | ({
              /**
               * The name of the task
               */
              readonly taskName: 'MAKE_WEBSITE';
          } & MakeWebsiteResult)
    );
