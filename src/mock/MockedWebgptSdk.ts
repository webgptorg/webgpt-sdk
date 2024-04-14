import { BehaviorSubject } from 'rxjs';
import spaceTrim from 'spacetrim';
import { forTime } from 'waitasecond';
import { IdeaNotAccepted } from '../errors/IdeaNotAccepted';
import type {
    MakeAssignmentOptions,
    MakeAssignmentProgress,
    MakeAssignmentResult,
    MakeAssignmentTask,
} from '../types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from '../types/MakeWebsite';
import type { TaskId } from '../types/Task';
import { notUsing } from '../utils/notUsing';
import { observableToPromise } from '../utils/observableToPromise';
import { $randomUuid } from '../utils/randomUuid';
import type { WebgptSdk } from '../WebgptSdk';

export class MockedWebgptSdk
    implements Pick<WebgptSdk, 'makeAssignment' | 'recoverAssignmentMaking' | 'makeWebsite' | 'recoverWebsiteMaking'>
{
    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        const { id = $randomUuid(), idea } = options;

        if (idea.length < 10) {
            throw new IdeaNotAccepted('Idea is too short');
        }

        const subject = new BehaviorSubject<MakeAssignmentResult | MakeAssignmentProgress>({
            status: 'RUNNING',
            message: 'Creating assignment...',
        });

        (async () => {
            await forTime(3000 /* <- Note: Waiting some dummy time */);

            subject.next({
                status: 'SUCCESS',
                message: 'Assignment created',
                assignment: spaceTrim(
                    (block) => `
                        Task is to create a new website:
                        > ${block(idea)}
                    `,
                ),
            });

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
    }

    public makeWebsite(options: MakeWebsiteOptions): MakeWebsiteTask {
        notUsing(options);
        throw new Error('Not implemented yet');
    }

    public recoverAssignmentMaking(id: TaskId): MakeAssignmentTask {
        notUsing(id);
        return this.makeAssignment({ idea: 'Some previous idea', language: 'en' });
    }

    public recoverWebsiteMaking(id: TaskId): MakeWebsiteTask {
        notUsing(id);
        return this.makeWebsite({ assignment: 'Some previous assignment', language: 'en' });
    }
}
