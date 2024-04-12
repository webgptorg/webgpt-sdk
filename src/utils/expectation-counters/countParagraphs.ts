import type { ExpectationAmount } from '../../types/PromptbookJson/PromptTemplateJson';

/**
 * Counts number of paragraphs in the text
 */
export function countParagraphs(text: string): ExpectationAmount {
    return text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '').length;
}
