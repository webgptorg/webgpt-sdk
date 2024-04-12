import { describe, expect, it } from '@jest/globals';
import { readdirSync } from 'fs';
import { join } from 'path';
import spaceTrim from 'spacetrim';
import { promptbookStringToJson } from '../promptbookStringToJson';
import { importPromptbook } from './_importPromptbook';
import { validatePromptbookJson } from './validatePromptbookJson';

describe('validatePromptbookJson', () => {
    const samplesDir = '../../../samples/templates';
    const samples = readdirSync(join(__dirname, samplesDir), { withFileTypes: true, recursive: false })
        //                         <- Note: In production it is not good practice to use synchronous functions
        //                                  But this is only a test before the build, so it is okay
        .filter((dirent) => dirent.isFile())
        .filter(({ name }) => name.endsWith('.md'))
        .filter(({ name }) => !name.endsWith('.report.md'));

    for (const { name } of samples) {
        it(`should validate ${name} logic`, () => {
            expect(() => {
                try {
                    const promptbookString = importPromptbook(join(samplesDir, name) as `${string}.ptbk.md`);
                    const promptbookJson = promptbookStringToJson(promptbookString);
                    validatePromptbookJson(promptbookJson);
                } catch (error) {
                    if (!(error instanceof Error)) {
                        throw error;
                    }

                    throw new Error(
                        spaceTrim(
                            (block) => `

                                Error in ${join(__dirname, samplesDir, name).split('\\').join('/')}:

                                ${block((error as Error).message)}

                            `,
                        ),
                    );
                }
            }).not.toThrowError();
        });
    }
});
