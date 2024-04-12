#!/usr/bin/env ts-node

import { MockedWebgptSdk } from '../src/mock/MockedWebgptSdk';

// Note: Normally you would import and use the WebgptSdk from the package:
//
//     > import { WebgptSdk } from '@webgpt/sdk';
//     >
//     >
//     > const webgpt = new WebgptSdk({
//     >     apiKey: 'YOUR_API_KEY',
//     > });

const webgpt = new MockedWebgptSdk();

const task = webgpt.createAssignment({ idea: `Krokodýlí Zoo` });
const { assignment } = await task.asPromise();

console.info(`Assignment:`, assignment);
