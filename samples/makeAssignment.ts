#!/usr/bin/env ts-node

import colors from 'colors';
import { WebgptSdk } from '../src/WebgptSdk'; // <- Note: [💫] In production there will be import from '@webgpt/sdk';

makeAssignment();

async function makeAssignment() {
    const webgpt = new WebgptSdk({
        apiKey: 'webgpt-sample-token', // <- Note: [💫] And your seacret token; ideally from environment configuration
    });

    const task = webgpt.makeAssignment({ idea: `Krokodýlí Zoo`, language: `cs` });

    task.asObservable().subscribe((progress) => {
        console.info(colors.bgBlue(progress.status), progress.message);
    });

    const { assignment } = await task.asPromise();

    console.info(colors.bgGreen(`Assignment:`), '\n', assignment);
}
