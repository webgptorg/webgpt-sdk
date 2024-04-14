import { describe, expect, it } from '@jest/globals';
import { WebgptSdk } from './WebgptSdk';

describe('how WebgptSdk works', () => {
    it('is constructable', () => {
        expect(
            () =>
                new WebgptSdk({
                    token: 'NOT_USED',
                }),
        ).not.toThrow();
    });
});

/**
 * TODO: Write real tests
 */
