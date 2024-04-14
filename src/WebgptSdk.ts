// import type { TaskProgress } from '@promptbook/types'; // <- TODO: !!! Uninstall @promptbook/* if not needed
import { countCharacters, countWords } from '@promptbook/utils';
import { BehaviorSubject } from 'rxjs';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { IdeaNotAccepted } from './errors/IdeaNotAccepted';
import type {
    MakeAssignmentOptions,
    MakeAssignmentProgress,
    MakeAssignmentResult,
    MakeAssignmentTask,
} from './types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from './types/MakeWebsite';
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

    public async checkCompatibility(): Promise<void> {}

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
        const { id = $randomUuid(), idea } = options;

        if (countCharacters(idea) < 10 || countWords(idea) < 2) {
            throw new IdeaNotAccepted('Idea is too short');
        }

        const subject = new BehaviorSubject<MakeAssignmentResult | MakeAssignmentProgress>({
            status: 'RUNNING',
            message: 'Creating assignment...',
        });

        (async () => {
            const socket = await this.makeConnection();
            socket.emit('request', { token: this.options.token, id, idea } satisfies SdkSocket_Request);

            const promptResult = await new Promise<Array<ImagePromptResult>>((resolve, reject) => {
                socket.on('response', (response: SdkSocket_Response) => {
                    resolve(response.promptResult);
                    socket.disconnect();
                });
                socket.on('error', (error: SdkSocket_Error) => {
                    //            <- TODO: Custom type of error
                    reject(new Error(error.errorMessage));
                    socket.disconnect();
                });

                // TODO: !! Use onProgress
            });

            socket.disconnect();
            subject.complete();
        })();

        return {
            id,
            asObservable() {
                return subject;
            },
            asPromise() {
                return observableToPromise(subject) as Promise<MakeAssignmentResult>; // <- TODO: Maybe check if it's really result not progress
            },
        };

        return promptResult;
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
