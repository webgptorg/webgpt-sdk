import { BehaviorSubject } from 'rxjs';
import spaceTrim from 'spacetrim';
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

export class MockedWebgptSdk implements WebgptSdk {
    public async checkCompatibility(): Promise<void> {}

    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        const { id = $randomUuid(), idea } = options;

        const subject = new BehaviorSubject<MakeAssignmentResult | MakeAssignmentProgress>({ assignment: idea });

        (async () => {
            subject.next({
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
