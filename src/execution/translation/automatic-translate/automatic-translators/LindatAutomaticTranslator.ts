import FormData from 'form-data';
import fetch from 'node-fetch'; /* <- TODO: [🌿] Use the Node native fetch */
import spaceTrim from 'spacetrim';
import { AutomaticTranslator } from './AutomaticTranslator';
import { TranslatorOptions } from './TranslatorOptions';
import { PromptbookExecutionError } from '../../../../errors/PromptbookExecutionError';

interface LindatAutomaticTranslatorOptions extends TranslatorOptions {
    apiUrl: URL;
}

export class LindatAutomaticTranslator implements AutomaticTranslator {
    public constructor(private readonly options: LindatAutomaticTranslatorOptions) {}
    public async translate(message: string): Promise<string> {
        const formData = new FormData();
        formData.append('input_text', message);
        formData.append('src', this.options.from);
        formData.append('tgt', this.options.to);

        const response = await fetch(
            this.options.apiUrl,

            {
                method: 'POST',
                body: formData,
            },
        );

        if (response.status === 200) {
            const translation = await response.text();
            return spaceTrim(translation);
        } else {
            const json = await response.json();
            if (json.message) {
                throw new PromptbookExecutionError(json.message);
            } else {
                throw new PromptbookExecutionError(
                    spaceTrim(`
                      Lindat: Unknown error
                      From: ${this.options.from}
                      To: ${this.options.to}
                      Message: ${message}
                      Status: ${response.status}
                      Response: ${JSON.stringify(json)}

                  `),
                );
            }
        }
    }
}
