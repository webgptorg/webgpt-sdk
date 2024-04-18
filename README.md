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
    apiKey: 'webgpt-sample-token',
});

const { assignment } = await webgpt
    .makeAssignment({
        idea: `Crocodile zoo`,
        language: `en`,
    })
    .asPromise();

console.info(`Assignment:`, '\n', assignment);
```

See more usage examples in the [/samples](./samples) directory.

## Capabilities of SDK

1. **Make assignment** Creates assignment from idea.
2. **Make website** Makes website from from idea and publishes it.

## Terminology

-   **Idea** is short description of the website, email from client or any other input that describes the desired website.
-   **Assignment** is precise and professional description of the website, content structure, name, domain, keywords, etc.
-   **Website Preview** is website inside the WebGPT system in editable state, for example https://webgpt.cz/fuel-factor-x-2plub5fh5wws
-   **Published Website** is the final product, the website live on the the domain, for example https://www.jezdimelevneji.cz/
-   **Task** is the process of creating the assignment or website.
    -   Every task has its unique ID
    -   Once started, task is running independently of the SDK instance
    -   Task can be recovered by its ID
    -   You can list all tasks and their statuses with `.asObservable()`
    -   Or just get the result with `.asPromise()`

## Access

The SDK is for our partners.

Token `webgpt-sample-token` works only for the sample usage. It behaves like a real token, but it does not create any real assignments or websites, just returns sample data.

If you are interested in using it, please contact us at [pavol@webgpt.cz](https://www.pavolhejny.com/contact).
