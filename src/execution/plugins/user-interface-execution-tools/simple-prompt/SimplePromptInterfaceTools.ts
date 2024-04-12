import spaceTrim from 'spacetrim';
import { CommonExecutionToolsOptions } from '../../../CommonExecutionToolsOptions';
import { UserInterfaceTools, UserInterfaceToolsPromptDialogOptions } from '../../../UserInterfaceTools';
import { PromptbookExecutionError } from '../../../../errors/PromptbookExecutionError';

/**
 * Wrapper around `window.prompt` synchronous function that interacts with the user via browser prompt
 *
 * Warning: It is used for testing and mocking
 *          **NOT intended to use in the production** due to its synchronous nature.
 */
export class SimplePromptInterfaceTools implements UserInterfaceTools {
    public constructor(private readonly options: CommonExecutionToolsOptions) {}

    /**
     * Trigger window.PROMPT DIALOG
     */
    public async promptDialog(options: UserInterfaceToolsPromptDialogOptions): Promise<string> {
        const answer = window.prompt(
            spaceTrim(
                (block) => `
                    ${block(options.promptTitle)}

                    ${block(options.promptMessage)}
                `,
            ),
        );

        if (this.options.isVerbose) {
            console.info(
                spaceTrim(
                    (block) => `
                        📖 ${block(options.promptTitle)}
                        👤 ${block(answer || '🚫 User cancelled prompt')}
                    `,
                ),
            );
        }

        if (answer === null) {
            throw new PromptbookExecutionError('User cancelled prompt');
        }

        return answer;
    }
}
