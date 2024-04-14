import type { TaskId } from '../Task';

/**
 * Socket.io error for sending tasks (and receiving result) to remote WebGPT SDK server
 *
 * This is sent from server to client and it’s a  generic type
 */
export type SdkSocket_Abstract = {
    /**
     * The id of the task
     */
    readonly id: TaskId;

    readonly taskName: 'MAKE_ASSIGNMENT' | 'MAKE_WEBSITE';

    readonly type: 'REQUEST' | 'PROGRESS' | 'RESPONSE' | 'ERROR';

    readonly message: string;
};
