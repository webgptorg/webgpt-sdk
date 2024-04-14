import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client when error occurs (which stopped the task)
 */
export type SdkSocket_Error = SdkSocket_Abstract & {
    readonly type: 'ERROR';

    error: {
        name: string;
        message: string;
    };
};
