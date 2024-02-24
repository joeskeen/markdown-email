/** the prepared email */
export interface RenderResult {
    /** the rendered HTML for the email body */
    html: string;
    /** the plaintext representation of the rendered HTML */
    text: string;
    subject?: string;
    /** @see https://nodemailer.com/message/attachments/ */
    attachments: Array<{
        filename: string;
        path: string;
        cid: string;
    }>;
}
export interface MarkdownEmailOptions {
    /**
     * An optional HTML template to insert the rendered message into. May include EJS expressions.
     * If HTML contains an element with class "message", the rendered message will be inserted into that element,
     * otherwise it will be inserted at the beginning of the body.
     */
    html?: string;
    /**
     * An optional CSS string to apply to the email's rendered HTML. All CSS will be inlined.
     */
    css?: string;
    /**
     * An optional subject to use instead of the one in the Markdown template
     */
    subject?: string;
}
