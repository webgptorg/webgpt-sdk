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
});

/**
 * TODO: Write real tests
 */
