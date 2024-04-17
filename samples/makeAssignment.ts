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
    //     >     apiKey: 'webgpt-token',
    //     > });

    const webgpt = new MockedWebgptSdk();

    const task = webgpt.makeAssignment({ idea: `Krokodýlí Zoo`, language: `cs` });

    task.asObservable().subscribe((progress) => {
        console.info(colors.bgBlue(progress.status), progress.message);
    });

    const { assignment } = await task.asPromise();

    console.info(colors.bgGreen(`Assignment:`), '\n', assignment);
}
