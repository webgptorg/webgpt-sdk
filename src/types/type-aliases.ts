/**
 * The ID of a task
 * This ID can be set by the consumer or generated by the SDK
 *
 * Note: There is also `internalId` in the SDK, but it is not exposed to the consumer; this is `externalId` in the database
 */
export type TaskId = string;

/**
 * Seacret Webgpt API key
 *
 * If you are interested in having one, please contact us at [pavol@webgpt.cz](https://www.pavolhejny.com/contact).
 */
export type ApiKey = `webgpt-${string}`;
