import { MarkdownEmailOptions, RenderResult } from "./interfaces.js";
/**
 * Prepares an HTML email from a Markdown template, with the ability to inject a custom HTML wrapper and CSS
 */
export declare function renderEmail(messageTemplateMarkdown: string, context: object, options?: MarkdownEmailOptions): Promise<RenderResult>;
