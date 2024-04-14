import type { MakeAssignmentOptions } from '../MakeAssignment';
import type { MakeWebsiteOptions } from '../MakeWebsite';
import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is a request from client to server
 */
export type SdkSocket_Request = SdkSocket_Abstract & {
    readonly type: 'REQUEST';
} & (
        | {
              taskName: 'MAKE_ASSIGNMENT';
              options: MakeAssignmentOptions;
          }
        | {
              taskName: 'MAKE_WEBSITE';
              options: MakeWebsiteOptions;
          }
    );
