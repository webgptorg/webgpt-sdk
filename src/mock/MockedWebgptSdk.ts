import { BehaviorSubject } from 'rxjs';
import type { TaskId } from '../types/_';
import type { MakeAssignmentOptions, MakeAssignmentTask } from '../types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from '../types/MakeWebsite';
import { notUsing } from '../utils/notUsing';
import type { WebgptSdk } from '../WebgptSdk';

export class MockedWebgptSdk implements WebgptSdk {
    public async checkCompatibility(): Promise<void> {}

    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        const { idea } = options;

        // TODO: !!! Better mock


        const asSubject = () => new BehaviorSubject({ assignment: idea });

        return { assignment: idea };
    }

    public makeWebsite(options: MakeWebsiteOptions): MakeWebsiteTask {
        notUsing(options);
        throw new Error('Not implemented yet');
    }

    public recoverAssignmentMaking(id: TaskId): MakeAssignmentTask {
        notUsing(id);
        return this.makeAssignment({ idea: 'Some previous idea' });
    }

    public recoverWebsiteMaking(id: TaskId): MakeWebsiteTask {
        notUsing(id);
        return this.makeWebsite({ assignment: 'Some previous assignment' });
    }
}
