import nodemailer from "nodemailer";
import config from "../config/config.js";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: 'sm'
      service: "gmail",
      // secure: false,
      auth: {
        type: "OAuth2",
        user: config.EMAIL_USER,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("Error connecting to email server:", error);
      } else {
        console.log("Email server is ready to send messages");
      }
    });
    const info = await transporter.sendMail({
      from: `"Beatly Music" <${config.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message sent: %s", info);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
