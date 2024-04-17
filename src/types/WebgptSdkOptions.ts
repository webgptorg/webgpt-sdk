import type { ApiKey } from './type-aliases';

export type WebgptSdkOptions = {
    /**
     * URL of the remote WebGPT server
     *
     * Note: Not using URL object (but pure string) to ensure compatibility with older environments
     * @default 'https://sdk.webgpt.cz/'
     */
    readonly remoteUrl?: string;

    /**
     * Path for the Socket.io server to listen
     *
     * @default  '/sdk/socket.io'
     */
    readonly path?: string;

    /**
     * Token for the SDK to authenticate with the WebGPT server server
     */
    readonly token: ApiKey;
};
