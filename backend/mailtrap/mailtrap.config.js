import Nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// Create Mailtrap client for template-based emails
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

// Create transport for regular emails with SSL configuration
export const mailtrapTransport = Nodemailer.createTransport({
  host: "send.smtp.mailtrap.io",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
  },
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

// Verify transport connection
mailtrapTransport.verify(function (error, success) {
  if (error) {
    console.log("Mailtrap verification error:", error);
  } else {
    console.log("Mailtrap server is ready to send emails");
  }
});
