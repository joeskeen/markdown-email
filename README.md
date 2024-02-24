# `markdown-email`

`markdown-email` is an opinionated library to transform a markdown file as an EJS
template into an HTML email, ready to send. 

It is designed to be used with `nodemailer` to send emails, but it can be adapted to be
used with any email sending library.

I wrote this because I have had to send a lot of automated emails in my career, and I
have found that it is very easy to make mistakes which make each email inconsistent
with the next, flag your email as spam or, don't work well with your recipient's email
client.

This library is designed to make it easier to send emails that look good, are
consistent, and are less likely to be flagged as spam.

This library has been tested against mailtrap.io's email testing feature, and it passes
both the HTML check and spam analysis. Of course, how well your email does depends on 
your template content. Check <https://www.caniemail.com/> to see what HTML and CSS 
features you can use in your email.

## Installation

```bash
npm install markdown-email
```

## Usage

```javascript
import {renderEmail} from 'markdown-email';
import {readFileSync} from 'fs';
import { createTransport } from 'nodemailer';

// You want to make all your messages have a consistent look.
// Create a template for your email messages. The message-specific content will 
// be inserted into the start of the <body> tag. This string can contain EJS
// expressions.
const html = readFileSync('path/to/html-template.html', 'utf8').toString();

// You can also include CSS in your template.
// Make sure you check that the CSS properties you use are supported by the email 
// clients you are targeting.
const css = readFileSync('path/to/css.css', 'utf8').toString();

// Read the message template from a Markdown file. This file can contain EJS
// expressions.
const messageTemplate = readFileSync('path/to/template.md', 'utf8').toString();

// this contains all the variables that are needed to render the template.
// Make sure you populate this object with every value needed for the EJS templates,
// or the rendering will fail (better fail here than send out a bad email).
const messageContext = {
    recipientName: 'John Doe',
    message: 'Hello, world!',
    alertDate: new Date(),
    productName: 'Acme Widget'
};

// Render the EJS templates, transform the Markdown to HTML, insert 
// it into the HTML template, and inline the CSS. 
const {subject, message, attachments} = await renderEmail(messageTemplate, messageContext{
    surroundingHtml: html,
    styles: css
});

const transport = createTransport({
    host: 'smtp.example.com',
    port: 587
    // ...
});
await transport.sendMail({
    from: 'your-send-address@example.com',
    to: 'your-recipient-address@example.com',
    subject: subject,
    html: message,
    attachments: attachments
});
```

See `src/test/e2e.mjs` for a complete example.

## Creating templates

You can use [EJS expressions](https://ejs.co/#docs) in your templates, including the message template as 
well as the email HTML.  When referencing variables from the provided context, prefix them with `$.`. 
For example:

```ts
const markdown = `Hello <%= $.name %>, this is a message for you!`;
const context = {name: 'John Doe'};
```

### Template validation at runtime

It is also important that the context object contains every variable that is used in the templates. If
a referenced value is not found in the context, the rendering will fail with an error. For example:

```ts
const markdown = `Hello <%= $.name %>, this is a message for you!`;
const context = {};
const output = await renderEmail(markdown, context);
```

Will result in the following error:

```bash
    throw new Error(`Missing required property ${name}`);
                      ^

Error: ejs:1
 >> 1| Hello <%= $.name %>, this is a message for you!

Missing required property name
```

### Subject

You can also include the message subject in your template. If you do, it will be templated, extracted,
removed from the message, and returned as part of the result. For example:

```ts
const markdown = `
% subject Hello <%= $.name %>

This is a message for you!
`;
const context = {name: 'John Doe'};
const output = await renderEmail(markdown, context);
console.log(output.subject); // "Hello John Doe"
console.log(output.message); // "This is a message for you!"
```

### Images

If you include images anywhere in your message (Markdown or HTML), they will be
base64-encoded and included as attachments in the result. The `img` tags will
automatically be updated to reference the attachment. For example:

```ts
const markdown = `
![My Image](path/to/image.png)
`;
const output = await renderEmail(markdown, {});
console.log(output.message); // "<img src='cid:(some generated id)' alt='My Image'>"
console.log(output.attachments); // [{filename: 'image.png', path: '(some base64 string)', cid: '(some generated id)'}]
```
