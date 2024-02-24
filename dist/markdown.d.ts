import { RendererObject, TokenizerAndRendererExtension } from "marked";
/** a Marked extension for extracting the subject if present in the Markdown template */
export declare function subjectExtension(subjectRef: {
    subject: string | undefined;
}): TokenizerAndRendererExtension;
export declare function htmlEscapeToText(html: string): string;
export declare const plainTextRenderer: RendererObject;
