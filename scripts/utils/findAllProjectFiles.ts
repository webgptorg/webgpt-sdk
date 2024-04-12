import glob from 'glob-promise';
import { join } from 'path';

export async function findAllProjectFiles(): Promise<Array<string>> {
    return await glob(
        join(__dirname, '../../src/**/*.{ts,tsx}').split('\\').join('/'),
    );
}
