import { MarkdownEmailOptions } from "./interfaces.js";
export declare function renderPlainTextEmail(messageTemplateMarkdown: string, context: object, options?: MarkdownEmailOptions): Promise<{
    text: string;
    subject?: string;
}>;
