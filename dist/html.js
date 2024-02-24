import { Marked } from "marked";
import { JSDOM } from "jsdom";
import { nanoid } from "nanoid";
import juice from "juice";
import htmlnano from "htmlnano";
import { subjectExtension } from "./markdown.js";
import { renderTemplate } from "./template.js";
export async function renderHtmlEmail(messageTemplateMarkdown, context, options = {}) {
    // allows subject to be extracted from Markdown
    const subjectRef = { subject: "" };
    const subjextExt = subjectExtension(subjectRef);
    const markedInstance = new Marked({ extensions: [subjextExt] });
    const messageMarkdownFragment = renderTemplate(messageTemplateMarkdown, context);
    // wrap Markdown with HTML template
    const emailHtmlTemplate = options?.html ?? "<!DOCTYPE html><html><body></body></html>";
    const emailHtml = renderTemplate(emailHtmlTemplate, context);
    const dom = new JSDOM(emailHtml);
    const document = dom.window.document;
    const messageContainer = document.querySelector(".message");
    if (messageContainer) {
        messageContainer.innerHTML = await markedInstance.parse(messageMarkdownFragment);
    }
    else {
        document.body.innerHTML =
            (await markedInstance.parse(messageMarkdownFragment)) +
                document.body.innerHTML;
    }
    // apply CSS
    if (options?.css) {
        const head = document.querySelector("head");
        if (head) {
            head.innerHTML += `<style>${options.css}</style>`;
        }
    }
    // extract images as attachments
    const imageAttachments = [];
    const images = document.querySelectorAll("img");
    for (let image of images) {
        const src = image.getAttribute("src");
        if (src) {
            let fileName = src.split("/").pop();
            if (!/\..{2,4}$/.test(fileName ?? "")) {
                fileName = "";
            }
            const imgResult = await fetch(src);
            const imgBuffer = await imgResult.arrayBuffer();
            const imgBase64 = Buffer.from(imgBuffer).toString("base64");
            const imgType = imgResult.headers.get("content-type");
            const dataUrl = `data:${imgType};base64,${imgBase64}`;
            const id = nanoid();
            imageAttachments.push({
                filename: fileName || `embeddedImage-${id}`,
                path: dataUrl,
                cid: id,
            });
            image.setAttribute("src", `cid:${id}`);
        }
    }
    // get the resulting DOM
    const html = dom.serialize();
    // inline CSS
    const inlined = juice(html);
    // some email clients don't support the `body` tag, so replace it with a `div`
    const body = new JSDOM(inlined).window.document.body;
    const htmlOutput = body.outerHTML.replace(/<(\/?)body/g, "<$1div");
    // minify the HTML
    const minified = await htmlnano.process(htmlOutput);
    return {
        attachments: imageAttachments,
        html: minified.html,
        subject: subjectRef.subject ?? options.subject ?? "",
    };
}
