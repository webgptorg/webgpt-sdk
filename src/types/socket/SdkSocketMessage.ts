import type { SdkSocket_Error } from './SdkSocket_Error';
import type { SdkSocket_Progress } from './SdkSocket_Progress';
import type { SdkSocket_Request } from './SdkSocket_Request';
import type { SdkSocket_Response } from './SdkSocket_Response';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client when error occurs (which stopped the task)
 */
export type SdkSocketMessage = SdkSocket_Request | SdkSocket_Progress | SdkSocket_Response | SdkSocket_Error;
