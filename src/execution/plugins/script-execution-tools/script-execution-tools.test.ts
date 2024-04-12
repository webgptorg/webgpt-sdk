import { describe, expect, it } from '@jest/globals';
import spaceTrim from 'spacetrim';
import { promptbookStringToJson } from '../../../conversion/promptbookStringToJson';
import { PromptbookString } from '../../../types/PromptbookString';
import { assertsExecutionSuccessful } from '../../assertsExecutionSuccessful';
import { createPromptbookExecutor } from '../../createPromptbookExecutor';
import { MockedEchoNaturalExecutionTools } from '../natural-execution-tools/mocked/MockedEchoNaturalExecutionTools';
import { CallbackInterfaceTools } from '../user-interface-execution-tools/callback/CallbackInterfaceTools';
import { JavascriptEvalExecutionTools } from './javascript/JavascriptEvalExecutionTools';

describe('createPromptbookExecutor + executing scripts in promptbook', () => {
    const promptbook = promptbookStringToJson(
        spaceTrim(`
            # Sample prompt

            Show how to execute a script

            -   PROMPTBOOK VERSION 1.0.0
            -   INPUT  PARAMETER {thing} Any thing to buy
            -   OUTPUT PARAMETER {bhing}

            ## Execution

            -   EXECUTE SCRIPT

            \`\`\`javascript
            thing.split('a').join('b')
            \`\`\`

            -> {bhing}
         `) as PromptbookString,
    );
    const promptbookExecutor = createPromptbookExecutor({
        promptbook,
        tools: {
            natural: new MockedEchoNaturalExecutionTools({ isVerbose: true }),
            script: [
                new JavascriptEvalExecutionTools({
                    isVerbose: true,
                    // Note: [🕎] Custom functions are tested elsewhere
                }),
            ],
            userInterface: new CallbackInterfaceTools({
                isVerbose: true,
                async callback() {
                    return 'Hello';
                },
            }),
        },
        settings: {
            maxExecutionAttempts: 3,
        },
    });

    it('should work when every INPUT  PARAMETER defined', () => {
        expect(promptbookExecutor({ thing: 'apple' }, () => {})).resolves.toMatchObject({
            isSuccessful: true,
            errors: [],
            outputParameters: {
                bhing: 'bpple',
            },
        });
        expect(promptbookExecutor({ thing: 'a cup of coffee' }, () => {})).resolves.toMatchObject({
            isSuccessful: true,
            errors: [],
            outputParameters: {
                bhing: 'b cup of coffee',
            },
        });
    });

    it('should fail when some INPUT  PARAMETER is missing', () => {
        expect(promptbookExecutor({}, () => {})).resolves.toMatchObject({
            isSuccessful: false,
            /*
            TODO:
            errors: [
                new PromptbookExecutionError(
                    spaceTrim(`
                        Parameter {thing} is not defined

                        This happen during evaluation of the javascript, which has access to the following parameters as javascript variables:

                        The script is:
                        \`\`\`javascript
                        return thing.split('a').join('b')
                        \`\`\`

                        Original error message:
                        thing is not defined
                  `),
                ),
            ],
            */
        });

        expect(() => promptbookExecutor({}, () => {}).then(assertsExecutionSuccessful)).rejects.toThrowError(
            /Parameter \{thing\} is not defined/,
        );
    });
});
