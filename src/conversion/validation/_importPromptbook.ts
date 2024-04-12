import { readFileSync } from 'fs';
import { join } from 'path';
import { PromptbookJson } from '../../types/PromptbookJson/PromptbookJson';
import { PromptbookString } from '../../types/PromptbookString';
import { string_file_path } from '../../types/typeAliases';

/**
 * Import the text file
 *
 * Note: Using here custom import to work in jest tests
 * Note: Using sync version is 💩 in the production code, but it's ok here in tests
 *
 * @private
 */
export function importPromptbook(path: `${string}.ptbk.md`): PromptbookString;
export function importPromptbook(path: `${string}.ptbk.json`): PromptbookJson;
export function importPromptbook(path: string_file_path): PromptbookString | PromptbookJson {
    const content = readFileSync(join(__dirname, path), 'utf-8');
    //                         <- Note: In production it is not good practice to use synchronous functions
    //                                  But this is only a test before the build, so it is okay
    if (path.endsWith('.ptbk.json')) {
        return JSON.parse(content) as PromptbookJson;
    } else if (path.endsWith('.ptbk.md')) {
        return content as PromptbookString;
    } else {
        throw new Error('This should be used only for .ptbk.md or .ptbk.json files');
    }
}
