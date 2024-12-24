import dotenv from "dotenv";
dotenv.config();

var transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: 587,
  auth: {
    user: "api",
    pass: process.env.MAILTRAP_PASSWORD,
  },
});
