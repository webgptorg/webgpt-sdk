import { describe, expect, it } from '@jest/globals';
import { WebgptSdk } from './WebgptSdk';

describe('how WebgptSdk works', () => {
    it('is constructable', () =>
        expect(
            () =>
                new WebgptSdk({
                    apiKey: 'webgpt-sample-token',
                }),
        ).not.toThrow());

    it('can make assignment', () =>
        expect(async () => {
            const webgpt = new WebgptSdk({
                apiKey: 'webgpt-sample-token', // <- Note: Testing with a sample token, which will work as expected but creates dummy assignments
            });

            const task = await webgpt.makeAssignment({ idea: `Krokodýlí Zoo`, language: `cs` });

            const { assignment } = await task.asPromise();

            if (assignment.length === 0) {
                throw new Error('Assignment is empty');
            }
        }).resolves.not.toThrow());
});

/**
 * TODO: Write real tests
 */
