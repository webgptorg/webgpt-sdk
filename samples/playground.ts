#!/usr/bin/env ts-node

import colors from 'colors';
import { WebgptSdk } from '../src/WebgptSdk';

playground();

/**
 * This is a playground for the WebgptSdk
 *
 * You can play with the SDK here, test different features, etc.
 */
async function playground() {
    const webgpt = new WebgptSdk({
        // remoteUrl: 'http://localhost:4447/',
        apiKey: 'webgpt-sample-token',
    });

    const task = webgpt.makeAssignment({ idea: `Krokodýlí Zoo`, language: `en` });

    task.asObservable().subscribe((progress) => {
        console.info(colors.bgBlue(progress.status), progress.message);
    });

    const { assignment } = await task.asPromise();

    console.info(colors.bgGreen(`Assignment:`), '\n', assignment);
}
