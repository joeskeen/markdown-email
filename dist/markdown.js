/** a Marked extension for extracting the subject if present in the Markdown template */
export function subjectExtension(subjectRef) {
    return {
        name: "subject",
        level: "block",
        start: (src) => {
            return src.match(/% subject [^%\n]*/)?.index;
        },
        tokenizer: ((src) => {
            const match = src.match(/% subject ([^%\n]*)[%\n]/);
            if (match) {
                return {
                    type: "subject",
                    raw: match[0],
                    subject: match[1],
                };
            }
        }),
        renderer: ((token) => {
            // we want to remove the subject from the output, but save it for later
            if (token.type === "subject") {
                subjectRef.subject = token.subject;
            }
            return ``;
        }),
    };
}
// see https://dustinpfister.github.io/2017/11/19/nodejs-marked/#3-Rendering-to-plain-text
export function htmlEscapeToText(html) {
    return html.replace(/\&\#?([0-9]+|amp|nbsp);/g, (_, entity) => {
        switch (entity.toLowerCase()) {
            case "nbsp":
                return " ";
            case "amp":
                return "&";
            default:
                return String.fromCharCode(Number(entity));
        }
    });
}
export const plainTextRenderer = {
    paragraph: (text) => `\r\n${htmlEscapeToText(text)}\r\n`,
    link: (href, _, text) => `${text} (link: ${href})`,
    heading: (text, level) => `\r\n${level}) ${text}\r\n`,
    list: (body, ordered) => `\r\n${ordered ? "1" : "-"} ${body}\r\n`,
    listitem: (text) => `${text}\r\n`,
    strong: (text) => `*${text}*`,
    em: (text) => `_${text}_`,
    codespan: (text) => `\`${text}\``,
    blockquote: (text) => `\r\n\t"${text}"\r\n`,
    br: () => `\r\n`,
    hr: () => `\r\n------------------------\r\n`,
    table: (header, body) => `\r\n${header}\r\n${body}\r\n`,
    tablerow: (content) => `| ${content}\r\n`,
    tablecell: (content) => `${content} | `,
    code: (code, language) => `\r\n${language}:\r\n${code}\r\n`,
    image: (href, _, text) => `${text} (image: ${href})`,
};
