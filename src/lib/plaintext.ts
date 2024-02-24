import { Marked } from "marked";
import { JSDOM } from "jsdom";
import { plainTextRenderer, subjectExtension } from "./markdown.js";
import { MarkdownEmailOptions } from "./interfaces.js";
import { renderTemplate } from "./template.js";

export async function renderPlainTextEmail(
  messageTemplateMarkdown: string,
  context: object,
  options: MarkdownEmailOptions = {}
): Promise<{ text: string; subject?: string }> {
  // allows subject to be extracted from Markdown
  const subjectRef = { subject: "" };
  const subjectExt = subjectExtension(subjectRef);
  // we want Marked to render to plain text instead of HTML
  const plainTextMarkedInstance = new Marked({
    extensions: [subjectExt],
    renderer: plainTextRenderer,
  });
  // render the template with EJS (still will be Markdown)
  const messageMarkdown = renderTemplate(messageTemplateMarkdown, context);
  // render the Markdown to plain text
  const plainTextMessageFragment = await plainTextMarkedInstance.parse(
    messageMarkdown
  );
  // by default we are done, but if there is an HTML template, we need to render the plain text into it
  let output = plainTextMessageFragment;
  if (options.html) {
    // render the EJS HTML template
    const html = renderTemplate(options.html, context);
    // inject the plain text into the correct part of the HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const messageContainer = document.querySelector(".message");
    if (messageContainer) {
      messageContainer.innerHTML = plainTextMessageFragment;
      output = messageContainer.textContent ?? "";
    }
  }
  return { text: output, subject: subjectRef.subject ?? options.subject ?? "" };
}
