// import type { TaskProgress } from '@promptbook/types'; // <- TODO: !!! Uninstall @promptbook/* if not needed
import type { MakeAssignmentOptions, MakeAssignmentTask } from './types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from './types/MakeWebsite';
import type { TaskId } from './types/Task';
import { notUsing } from './utils/notUsing';

export class WebgptSdk {
    constructor() {
        console.log('WebgptSdk constructor');
    }

    public async checkCompatibility(): Promise<void> {}

    /**
     * Creates a new assignment based on the idea.
     *
     * @throws {IdeaNotAccepted} If the idea is not good enough
     */
    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        notUsing(options);
        throw new Error('Not implemented yet');
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
