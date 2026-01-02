const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendMail(toEmail, pdfPath) {
    return transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: toEmail,
        subject: "December Newsletter",
        text: "Please find the attached PDF.",
        attachments: [
            {
                filename: "attachment.pdf",
                path: pdfPath
            }
        ]
    });
}

module.exports = sendMail;
