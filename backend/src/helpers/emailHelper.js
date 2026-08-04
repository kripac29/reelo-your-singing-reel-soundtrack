const path = require("path");
const { BrevoClient } = require("@getbrevo/brevo");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

// @getbrevo/brevo v6 uses a single client rather than the legacy
// TransactionalEmailsApi class from the older SDK.
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  try {
    return await brevo.transactionalEmails.sendTransacEmail({
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
