# ⏣ WebGPT SDK

WebGPT SDK is a TypeScript / JavaScript library for interacting with the [WebGPT](https://webgpt.cz/) API.

## Usage

First, install the package:

```bash

npm i @webgpt/sdk

```

Then, you can use the SDK in your code:

```typescript
import { WebgptSdk } from '@webgpt/sdk';

const webgpt = new WebgptSdk({
    apiKey: 'YOUR_API_KEY',
});

const task = webgpt.makeAssignment({
    idea: `Crocodile zoo`
    language: `en`,
});

const { assignment } = await task.asPromise();

console.info(`Assignment:`, '\n', assignment);
```

See more usage examples in the [/samples](./samples) directory.

## Access

This is internal SDK for our partners.
If you are interested in using it, please contact us at [pavol@webgpt.cz](https://www.pavolhejny.com/contact).
