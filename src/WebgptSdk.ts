// import type { TaskProgress } from '@promptbook/types'; // <- TODO: !!! Uninstall @promptbook/* if not needed
import { countCharacters, countWords } from '@promptbook/utils';
import { BehaviorSubject } from 'rxjs';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
// !!!! import { version } from '../package.json';
import { IdeaNotAccepted } from './errors/IdeaNotAccepted';
import { UnexpectedError } from './errors/UnexpectedError';
import type {
    MakeAssignmentOptions,
    MakeAssignmentProgress,
    MakeAssignmentResult,
    MakeAssignmentTask,
} from './types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from './types/MakeWebsite';
import type { SdkSocket_Error } from './types/socket/SdkSocket_Error';
import type { SdkSocket_Progress } from './types/socket/SdkSocket_Progress';
import type { SdkSocket_Request } from './types/socket/SdkSocket_Request';
import type { SdkSocket_Response } from './types/socket/SdkSocket_Response';
import type { TaskId } from './types/Task';
import { notUsing } from './utils/notUsing';
import { observableToPromise } from './utils/observableToPromise';
import { $randomUuid } from './utils/randomUuid';

export type WebgptSdkOptions = {
    token: string;
};

export class WebgptSdk {
    constructor(private readonly options: WebgptSdkOptions) {
        console.log('WebgptSdk constructor');
    }

    /**
     * Creates a connection to the remote proxy server.
     */
    private makeConnection(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const socket = io('http://localhost/', {
                path: '/sdk/socket.io',
                transports: [/*'websocket', <- TODO: [🌬] Make websocket transport work */ 'polling'],
            });

            socket.on('connect', () => {
                resolve(socket);
            });

            setTimeout(() => {
                reject(new Error(`Timeout while connecting to WebGPT SDK server.`));
            }, 60000 /* <- TODO: Timeout to config */);
        });
    }

    /**
     * Creates a new assignment based on the idea.
     *
     * @throws {IdeaNotAccepted} If the idea is not good enough
     */
    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        const { id = $randomUuid(), idea, language } = options;

        if (countCharacters(idea) < 10 || countWords(idea) < 2) {
            throw new IdeaNotAccepted('Idea is too short');
        }

        const subject = new BehaviorSubject<MakeAssignmentResult | MakeAssignmentProgress>({
            status: 'RUNNING',
            message: 'Creating assignment...',
        });

        (async () => {
            const socket = await this.makeConnection();
            socket.emit('request', {
                token: this.options.token,
                sdkVersion: /*version*/ '!!!!',
                id,
                type: 'REQUEST',
                taskName: 'MAKE_ASSIGNMENT',
                idea,
                language,
            } satisfies SdkSocket_Request);

            socket.on('response', (response: SdkSocket_Response) => {
                if (id !== response.id) {
                    return;
                }

                // TODO: [💢] Maybe no need to check this
                if (response.taskName !== 'MAKE_ASSIGNMENT') {
                    return subject.error(
                        new UnexpectedError(`Expected taskName to be 'MAKE_ASSIGNMENT' but got ${response.taskName}`),
                    );
                }

                subject.next({
                    status: 'SUCCESS',
                    message: response.message,
                    assignment: response.assignment,
                });

                subject.complete();
                socket.disconnect();
            });

            socket.on('progress', (response: SdkSocket_Progress) => {
                if (id !== response.id) {
                    return;
                }

                // TODO: [💢] Maybe no need to check this
                if (response.taskName !== 'MAKE_ASSIGNMENT') {
                    return subject.error(
                        new UnexpectedError(`Expected taskName to be 'MAKE_ASSIGNMENT' but got ${response.taskName}`),
                    );
                }
                subject.next(response);
            });

            socket.on('error', (error: SdkSocket_Error) => {
                if (id !== error.id) {
                    return;
                }

                subject.error(new Error(error.message));

                // TODO: [🧠] Should we disconnect and close here?
                subject.complete();
                socket.disconnect();
            });
        })();

        return {
            id,
            asObservable() {
                return subject;
            },
            asPromise() {
                return observableToPromise(subject) as Promise<MakeAssignmentResult>;
            },
        };
    }

    /**
     * Connects to the existing task based on id
     */
    public recoverAssignmentMaking(id: TaskId): MakeAssignmentTask {
        notUsing(id);
        throw new Error('Not implemented yet');
    }

    public makeWebsite(options: MakeWebsiteOptions): MakeWebsiteTask {
        notUsing(options);
        throw new Error('Not implemented yet');
    }

    public recoverWebsiteMaking(id: TaskId): MakeWebsiteTask {
        notUsing(id);
        throw new Error('Not implemented yet');
    }
}

/**
 * TODO: !!! Annotate all (+with @throws)
 */
