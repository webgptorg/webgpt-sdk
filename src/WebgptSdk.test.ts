import { describe, expect, it } from '@jest/globals';
import { forTime } from 'waitasecond';
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
        expect(
            (async () => {
                const webgpt = new WebgptSdk({
                    apiKey: 'webgpt-sample-token', // <- Note: Testing with a sample token, which will work as expected but creates dummy assignments
                });

                const task = await webgpt.makeAssignment({ idea: `Krokodýlí Zoo`, language: `cs` });

                const { assignment } = await task.asPromise();

                if (assignment.length === 0) {
                    throw new Error('Assignment is empty');
                }

                return assignment;
            })(),
        ).resolves.toMatch(/Struktura obsahu webu/i));

    it('can handle a error', () =>
        expect(
            (async () => {
                await forTime(1000);
                throw new Error('Test');
            })(),
        ).rejects.toThrowError(/Test/));
});
