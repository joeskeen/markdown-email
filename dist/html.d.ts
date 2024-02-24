import { MarkdownEmailOptions } from "./interfaces.js";
export declare function renderHtmlEmail(messageTemplateMarkdown: string, context: object, options?: MarkdownEmailOptions): Promise<{
    html: string;
    subject?: string;
    attachments: Array<{
        filename: string;
        path: string;
        cid: string;
    }>;
}>;
