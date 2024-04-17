import type { MakeAssignmentOptions } from '../MakeAssignment';
import type { MakeWebsiteOptions } from '../MakeWebsite';
import type { ApiKey } from '../type-aliases';
import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is a request from client to server
 */
export type SdkSocket_Request = SdkSocket_Abstract & {
    /**
     * Token for the SDK to authenticate with the WebGPT server
     */
    readonly apiKey: ApiKey;

    /**
     * Version of the SDK
     *
     * Note: SDK puts the version of itself automatically
     * Note: This is used for debugging purposes
     */
    readonly sdkVersion: string;

    /**
     * The type of the request
     */
    readonly type: 'REQUEST';
} & (
        | ({
              /**
               * The name of the task
               */
              readonly taskName: 'MAKE_ASSIGNMENT';
          } & MakeAssignmentOptions)
        | ({
              /**
               * The name of the task
               */
              readonly taskName: 'MAKE_WEBSITE';
          } & MakeWebsiteOptions)
    );
