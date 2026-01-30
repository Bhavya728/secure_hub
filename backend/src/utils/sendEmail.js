import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

export const sendEmail = async ({ to, subject, text }) => {
  const transport = getTransporter();

  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};
