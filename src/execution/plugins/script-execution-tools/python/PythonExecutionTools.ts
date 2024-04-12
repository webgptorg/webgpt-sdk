import spaceTrim from 'spacetrim';
import { CommonExecutionToolsOptions } from '../../../CommonExecutionToolsOptions';
import { ScriptExecutionTools, ScriptExecutionToolsExecuteOptions } from '../../../ScriptExecutionTools';
import { PromptbookExecutionError } from '../../../../errors/PromptbookExecutionError';

/**
 * ScriptExecutionTools for Python
 *
 * Warning: This is not implemented yet
 */
export class PythonExecutionTools implements ScriptExecutionTools {
    public constructor(private readonly options: CommonExecutionToolsOptions) {}

    /**
     * Executes a Python
     */
    public async execute(options: ScriptExecutionToolsExecuteOptions): Promise<string> {
        const { scriptLanguage, script } = options;

        if (scriptLanguage !== 'python') {
            throw new PromptbookExecutionError(`Script language ${scriptLanguage} not supported to be executed by PythonExecutionTools`);
        }

        if (this.options.isVerbose) {
            console.info(
                spaceTrim(
                    (block) => `
                        🚀 NOT Evaluating ${scriptLanguage} script:

                        ${block(script)}`,
                ),
            );
        }

        throw new PromptbookExecutionError('Not implemented');
    }
}
