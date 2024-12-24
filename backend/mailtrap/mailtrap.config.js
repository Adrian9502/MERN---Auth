import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";

// Load environment variables from .env file
dotenv.config();

export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_HOST,
  token: process.env.MAILTRAP_API_TOKEN,
});

// sender
export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "John Adrian Bonto",
};
