const path = require("path");
const SibApiV3Sdk = require("@getbrevo/brevo");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  try {
    return await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "Reelo",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });
  } catch (error) {
    console.error("Brevo email failed:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};