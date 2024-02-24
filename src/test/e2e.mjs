import { renderEmail } from "../../dist/index.js";

const messageMarkdown = `
% subject My first email

Hello <%= $.name %>!

This is a test email. I hope you like it!
`;
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="message"></div>
    <div>
        Thanks,<br>
        <%= $.name %>
    </div>
    <img src="https://icanhazdadjoke.com/static/smile.svg" alt="smile">
</body>
</html>
`;
const css = `
body {
    font-family: Arial, sans-serif;
}
h1 {
    color: red;
}
`;
const context = {
  name: "John Doe",
};

const preparedMessage = await renderEmail(messageMarkdown, context, { html, css });

const emailObject = {
  from: "support@tactilesplus.com",
  to: "to@example.com",
  subject: preparedMessage.subject || "Test email",
  html: preparedMessage.html,
  text: preparedMessage.text,
  attachments: preparedMessage.attachments,
};
console.log(emailObject);

// the message is now read to send via nodemailer or your favorite email library
// const transport = createTransport({
//  ...transportOptions
// });
// const sendResult = await transport.sendMail(emailObject);
