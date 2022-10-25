const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTPHost,
  port: process.env.SMTPPort,
  secure: true,
  auth: {
    user: process.env.SMTPUsername,
    pass: process.env.SMTPPassword,
  }
});

module.exports.NoReply = (to, subject, text) => {
  transporter.sendMail({
    from: `"No Reply" <noReply@${process.env.SMTPAddresses}>`,
    to: to.toString(),
    subject,
    text
  });
};