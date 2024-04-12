import { normalizeTo_PascalCase } from 'n12';
import spaceTrim from 'spacetrim';
import { Writable, WritableDeep } from 'type-fest';
import { PromptbookSyntaxError } from '../errors/PromptbookSyntaxError';
import { ParameterCommand } from '../types/Command';
import { ExecutionType } from '../types/ExecutionTypes';
import { ModelRequirements } from '../types/ModelRequirements';
import { ExpectationUnit, PromptTemplateJson } from '../types/PromptbookJson/PromptTemplateJson';
import { PromptTemplateParameterJson } from '../types/PromptbookJson/PromptTemplateParameterJson';
import { PromptbookJson } from '../types/PromptbookJson/PromptbookJson';
import { PromptbookString } from '../types/PromptbookString';
import { SUPPORTED_SCRIPT_LANGUAGES, ScriptLanguage } from '../types/ScriptLanguage';
import { extractParameters } from '../utils/extractParameters';
import { countMarkdownStructureDeepness } from '../utils/markdown-json/countMarkdownStructureDeepness';
import { markdownToMarkdownStructure } from '../utils/markdown-json/markdownToMarkdownStructure';
import { extractAllListItemsFromMarkdown } from '../utils/markdown/extractAllListItemsFromMarkdown';
import { extractOneBlockFromMarkdown } from '../utils/markdown/extractOneBlockFromMarkdown';
import { removeContentComments } from '../utils/markdown/removeContentComments';
import { PROMPTBOOK_VERSION } from '../version';
import { extractVariables } from './utils/extractVariables';
import { parseCommand } from './utils/parseCommand';

/**
 * Parse promptbook from string format to JSON format
 *
 * @throws {PromptbookSyntaxError} if the promptbook string is not valid
 *
 * Note: This function does not validate logic of the pipeline only the syntax
 */
export function promptbookStringToJson(promptbookString: PromptbookString): PromptbookJson {
    const promptbookJson: WritableDeep<PromptbookJson> = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: undefined as any /* <- Note: Putting here placeholder to keep `title` on top at final JSON */,
        promptbookUrl: undefined /* <- Note: Putting here placeholder to keep `promptbookUrl` on top at final JSON */,
        promptbookVersion: PROMPTBOOK_VERSION,
        description: undefined /* <- Note: Putting here placeholder to keep `description` on top at final JSON */,
        parameters: [],
        promptTemplates: [],
    };

    // =============================================================
    // Note: 1️⃣ Normalization of the PROMPTBOOK string
    promptbookString = removeContentComments(promptbookString);
    promptbookString = promptbookString.replaceAll(
        /`\{(?<parameterName>[a-z0-9_]+)\}`/gi,
        '{$<parameterName>}',
    ) as PromptbookString;
    promptbookString = promptbookString.replaceAll(
        /`->\s+\{(?<parameterName>[a-z0-9_]+)\}`/gi,
        '-> {$<parameterName>}',
    ) as PromptbookString;

    // =============================================================
    ///Note: 2️⃣ Function for adding parameters
    const addParam = (parameterCommand: Omit<ParameterCommand, 'type'>) => {
        const { parameterName, parameterDescription, isInput, isOutput } = parameterCommand;

        const existingParameter = promptbookJson.parameters.find(
            (parameter: PromptTemplateParameterJson) => parameter.name === parameterName,
        );
        if (
            existingParameter &&
            existingParameter.description &&
            existingParameter.description !== parameterDescription &&
            parameterDescription
        ) {
            throw new PromptbookSyntaxError(
                spaceTrim(
                    (block) => `
                        Parameter {${parameterName}} is defined multiple times with different description.

                        First definition:
                        ${block(existingParameter.description || '[undefined]')}

                        Second definition:
                        ${block(parameterDescription || '[undefined]')}
                    `,
                ),
            );
        }

        if (existingParameter) {
            if (parameterDescription) {
                existingParameter.description = parameterDescription;
            }
        } else {
            promptbookJson.parameters.push({
                name: parameterName,
                description: parameterDescription || undefined,
                isInput,
                isOutput,
            });
        }
    };

    // =============================================================
    // Note: 3️⃣ Parse the dynamic part - the template pipeline
    const markdownStructure = markdownToMarkdownStructure(promptbookString);
    const markdownStructureDeepness = countMarkdownStructureDeepness(markdownStructure);

    if (markdownStructureDeepness !== 2) {
        throw new PromptbookSyntaxError(
            spaceTrim(`
                Invalid markdown structure.
                The markdown must have exactly 2 levels of headings (one top-level section and one section for each template).
                Now it has ${markdownStructureDeepness} levels of headings.
            `),
        );
    }

    promptbookJson.title = markdownStructure.title;

    // TODO: [1] DRY description
    let description: string | undefined = markdownStructure.content;

    // Note: Remove codeblocks
    description = description.split(/^```.*^```/gms).join('');
    //Note: Remove lists and return statement
    description = description.split(/^(?:(?:-)|(?:\d\))|(?:`?->))\s+.*$/gm).join('');
    description = spaceTrim(description);
    if (description === '') {
        description = undefined;
    }
    promptbookJson.description = description;

    const defaultModelRequirements: Partial<Writable<ModelRequirements>> = {};
    const listItems = extractAllListItemsFromMarkdown(markdownStructure.content);
    for (const listItem of listItems) {
        const command = parseCommand(listItem);

        switch (command.type) {
            case 'PROMPTBOOK_URL':
                promptbookJson.promptbookUrl = command.promptbookUrl.href;
                break;

            case 'PROMPTBOOK_VERSION':
                promptbookJson.promptbookVersion = command.promptbookVersion;
                break;

            case 'MODEL':
                defaultModelRequirements[command.key] = command.value;
                break;

            case 'PARAMETER':
                addParam(command);
                break;

            default:
                throw new PromptbookSyntaxError(
                    `Command ${command.type} is not allowed in the head of the promptbook ONLY at the prompt template block`,
                );
        }
    }

    for (const section of markdownStructure.sections) {
        // TODO: Parse prompt template description (the content out of the codeblock and lists)

        const templateModelRequirements: Partial<Writable<ModelRequirements>> = { ...defaultModelRequirements };
        const listItems = extractAllListItemsFromMarkdown(section.content);
        let dependentParameterNames: PromptTemplateJson['dependentParameterNames'] = [];
        let executionType: ExecutionType = 'PROMPT_TEMPLATE';
        let jokers: PromptTemplateJson['jokers'] = [];
        let postprocessing: PromptTemplateJson['postprocessing'] = [];
        let expectAmount: PromptTemplateJson['expectAmount'] = {};
        let expectFormat: PromptTemplateJson['expectFormat'] | undefined = undefined;

        let isExecutionTypeChanged = false;

        for (const listItem of listItems) {
            const command = parseCommand(listItem);
            switch (command.type) {
                case 'JOKER':
                    jokers.push(command.parameterName);
                    dependentParameterNames.push(command.parameterName);
                    break;
                case 'EXECUTE':
                    if (isExecutionTypeChanged) {
                        throw new PromptbookSyntaxError(
                            'Execution type is already defined in the prompt template. It can be defined only once.',
                        );
                    }
                    executionType = command.executionType;
                    isExecutionTypeChanged = true;
                    break;

                case 'MODEL':
                    templateModelRequirements[command.key] = command.value;
                    break;

                case 'PARAMETER':
                    // Note: This is just for detecting resulitng parameter name
                    addParam(command);
                    break;
                case 'POSTPROCESS':
                    postprocessing.push(command.functionName);
                    break;

                case 'EXPECT_AMOUNT':
                    // eslint-disable-next-line no-case-declarations
                    const unit = command.unit.toLowerCase() as Lowercase<ExpectationUnit>;

                    expectAmount[unit] = expectAmount[unit] || {};

                    if (command.sign === 'MINIMUM' || command.sign === 'EXACTLY') {
                        if (expectAmount[unit]!.min !== undefined) {
                            throw new PromptbookSyntaxError(
                                `Already defined minumum ${
                                    expectAmount[unit]!.min
                                } ${command.unit.toLowerCase()}, now trying to redefine it to ${command.amount}`,
                            );
                        }
                        expectAmount[unit]!.min = command.amount;
                    } /* not else */
                    if (command.sign === 'MAXIMUM' || command.sign === 'EXACTLY') {
                        if (expectAmount[unit]!.max !== undefined) {
                            throw new PromptbookSyntaxError(
                                `Already defined maximum ${
                                    expectAmount[unit]!.max
                                } ${command.unit.toLowerCase()}, now trying to redefine it to ${command.amount}`,
                            );
                        }
                        expectAmount[unit]!.max = command.amount;
                    }
                    break;

                case 'EXPECT_FORMAT':
                    if (expectFormat !== undefined && command.format !== expectFormat) {
                        throw new PromptbookSyntaxError(
                            `Expect format is already defined to "${expectFormat}". Now you try to redefine it by "${command.format}".`,
                        );
                    }
                    expectFormat = command.format;

                    break;

                default:
                    throw new PromptbookSyntaxError(
                        `Command ${command.type} is not allowed in the block of the prompt template ONLY at the head of the promptbook`,
                    );
            }
        }

        const { language, content } = extractOneBlockFromMarkdown(section.content);

        if (executionType === 'SCRIPT') {
            if (!language) {
                throw new PromptbookSyntaxError('You must specify the language of the script in the prompt template');
            } else if (!SUPPORTED_SCRIPT_LANGUAGES.includes(language as ScriptLanguage)) {
                throw new PromptbookSyntaxError(
                    spaceTrim(
                        (block) => `
                            Script language ${language} is not supported.

                            Supported languages are:
                            ${block(SUPPORTED_SCRIPT_LANGUAGES.join(', '))}

                        `,
                    ),
                );
            }
        }

        const lastLine = section.content.split('\n').pop()!;
        const match = /^->\s*\{(?<resultingParamName>[a-z0-9_]+)\}/im.exec(lastLine);
        if (!match || match.groups === undefined || match.groups.resultingParamName === undefined) {
            throw new PromptbookSyntaxError(
                spaceTrim(
                    (block) => `
                        Invalid template - each section must end with "-> {...}"

                        Invalid section:
                        ${block(
                            // TODO: Show code of invalid sections each time + DRY
                            section.content
                                .split('\n')
                                .map((line) => `> ${line}`)
                                .join('\n'),
                        )}
                        `,
                ),
            );
        }
        const resultingParameterName = match.groups.resultingParamName;

        // TODO: [1] DRY description
        let description: string | undefined = section.content;

        // Note: Remove codeblocks
        description = description.split(/^```.*^```/gms).join('');
        //Note: Remove lists and return statement
        description = description.split(/^(?:(?:-)|(?:\d\))|(?:`?->))\s+.*$/gm).join('');
        description = spaceTrim(description);
        if (description === '') {
            description = undefined;
        }

        if (Object.keys(jokers).length === 0) {
            jokers = undefined;
        }

        if (Object.keys(expectAmount).length === 0) {
            expectAmount = undefined;
        }

        if (Object.keys(postprocessing).length === 0) {
            postprocessing = undefined;
        }

        for (const parameterName of [
            ...extractParameters(section.title),
            ...extractParameters(description || ''),
            ...extractParameters(content),
        ]) {
            dependentParameterNames.push(parameterName);
        }

        if (executionType === 'SCRIPT') {
            for (const parameterName of extractVariables(content)) {
                dependentParameterNames.push(parameterName);
            }
        }

        dependentParameterNames = [...new Set(dependentParameterNames)];

        promptbookJson.promptTemplates.push({
            name: normalizeTo_PascalCase(section.title),
            title: section.title,
            description,
            dependentParameterNames,
            executionType,
            jokers,
            postprocessing,
            expectAmount,
            expectFormat,
            modelRequirements: templateModelRequirements as ModelRequirements,
            contentLanguage: executionType === 'SCRIPT' ? (language as ScriptLanguage) : undefined,
            content,
            resultingParameterName,
        });
    }

    // =============================================================
    return promptbookJson;
}

/**
 * TODO: Report here line/column of error
 * TODO: Use spaceTrim more effectively
 * TODO: [🧠] Parameter flags - isInput, isOutput, isInternal
 */
