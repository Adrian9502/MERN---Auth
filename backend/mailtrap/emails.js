import {
  mailtrapTransport,
  sender,
  mailtrapClient,
} from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await mailtrapTransport.sendMail({
      from: sender.email,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Detailed error:", error);
    if (error.code === "ECONNECTION") {
      throw new Error(
        "Failed to connect to email server. Please check your network connection."
      );
    } else if (error.code === "EAUTH") {
      throw new Error(
        "Email authentication failed. Please check your credentials."
      );
    } else {
      throw new Error(`Error sending verification email: ${error.message}`);
    }
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      template_uuid: "9e3e1772-ee8f-4db4-8c44-69f7be3ee4df",
      template_variables: {
        company_info_name: "MERN AUTH - Bonts Company",
        name: name,
      },
    });
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error(`Error sending welcome email: ${error}`);
    throw new Error("Error sending welcome email: " + error.message);
  }
};
