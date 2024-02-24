import { MarkdownEmailOptions, RenderResult } from "./interfaces.js";
import { renderHtmlEmail } from "./html.js";
import { renderPlainTextEmail } from "./plaintext.js";

/**
 * Prepares an HTML email from a Markdown template, with the ability to inject a custom HTML wrapper and CSS
 */
export async function renderEmail(
  messageTemplateMarkdown: string,
  context: object,
  options: MarkdownEmailOptions = {}
): Promise<RenderResult> {
  const htmlEmail = await renderHtmlEmail(messageTemplateMarkdown, context, options);
  const plaintextEmail = await renderPlainTextEmail(messageTemplateMarkdown, context, options);

  return {
    ...plaintextEmail,
    ...htmlEmail,
  };
}
