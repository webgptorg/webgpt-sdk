# WebGPT SDK

## Usage

```bash

npm i @webgpt/sdk

```

```javascript
import { WebgptSdk } from '@webgpt/sdk';

const webgpt = new WebgptSdk({
    apiKey: 'YOUR_API_KEY',
});

const assignment = webgpt.createAssignment(`Krokodýlí Zoo`, (taskProgress) => {
    console.info(`Progress:`, taskProgress);
});

// TODO: !!!
```
