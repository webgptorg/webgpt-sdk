// import type { TaskProgress } from '@promptbook/types'; // <- TODO: !!! Uninstall @promptbook/* if not needed
import type { MakeAssignmentOptions } from './types/MakeAssignment';
import type { MakeWebsiteOptions, MakeWebsiteTask } from './types/MakeWebsite';
import type { MakeAssignmentTask, TaskId } from './types/Task';
import { notUsing } from './utils/notUsing';

export class WebgptSdk {
    constructor() {
        console.log('WebgptSdk constructor');
    }

    public async checkCompatibility(): Promise<void> {}

    public makeAssignment(options: MakeAssignmentOptions): MakeAssignmentTask {
        notUsing(options);
        throw new Error('Not implemented yet');
    }

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
