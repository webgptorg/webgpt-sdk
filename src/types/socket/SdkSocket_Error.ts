import type { SdkSocket_Abstract } from './SdkSocket_Abstract';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client when error occurs (which stopped the task)
 */
export type SdkSocket_Error = SdkSocket_Abstract & {
    /**
     * The type of the request
     */
    readonly type: 'ERROR';

    /**
     * Name of the error
     *
     * @example 'Error'
     * @example 'NotFoundError'
     * @example 'IdeaNotAccepted'
     */
    readonly errorName: string;

    /**
     * Technical message in english
     */
    readonly message: string;
};
