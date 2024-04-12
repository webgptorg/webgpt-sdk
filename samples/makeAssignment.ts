#!/usr/bin/env ts-node

import colors from 'colors';
import { MockedWebgptSdk } from '../src/mock/MockedWebgptSdk';

makeAssignment();

async function makeAssignment() {
    // Note: Normally you would import and use the WebgptSdk from the package:
    //
    //     > import { WebgptSdk } from '@webgpt/sdk';
    //     >
    //     >
    //     > const webgpt = new WebgptSdk({
    //     >     apiKey: 'YOUR_API_KEY',
    //     > });

    const webgpt = new MockedWebgptSdk();

    const task = webgpt.makeAssignment({ idea: `Krokodýlí Zoo` });

    task.asObservable().subscribe({
        next(progress) {
            console.info(colors.bgBlue(`Progress:`), progress);
        },
        error(error) {
            console.error(colors.bgRed(`Error:`), error);
        },
        complete() {
            console.info(colors.bgGreen(`Completed`));
        },
    });

    const { assignment } = await task.asPromise();

    console.info(colors.bgGreen(`Assignment:`), assignment);
}
