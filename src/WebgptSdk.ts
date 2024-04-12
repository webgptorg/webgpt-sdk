import type { TaskProgress } from '@promptbook/types';

export class WebgptSdk {
    constructor() {
        console.log('WebgptSdk constructor');
    }

    public async createAssignment(
        idea: string,
        onProgress: (taskProgress: TaskProgress) => void,
    ): Promise<{ assignment: string }> {
        onProgress;
        // TODO: !!! Better mock
        return { assignment: idea };
    }
}

/**
 * TODO: !!! Annotate all
 */
