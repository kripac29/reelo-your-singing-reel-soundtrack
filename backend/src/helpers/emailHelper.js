const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sanitizedPassword = String(process.env.SMTP_PASS || "").replace(/\s+/g, "");
const smtpPort = Number(process.env.SMTP_PORT || 587);

if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
  throw new Error("SMTP_PORT must be a valid port number");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  // SMTP port 465 uses TLS immediately; port 587 upgrades with STARTTLS.
  secure: smtpPort === 465,
  requireTLS: process.env.SMTP_REQUIRE_TLS === "true",
  // Do not leave signup requests pending when an SMTP host is unreachable.
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
  auth: {
    user: process.env.SMTP_USER,
    pass: sanitizedPassword,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !sanitizedPassword) {
    throw new Error("SMTP credentials are not configured");
  }

  if (!to) {
    throw new Error("A recipient email address is required");
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    // Preserve the provider error code in server logs without returning SMTP
    // details or credentials to a public API caller.
    console.error("SMTP delivery failed", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      message: error.message,
    });
    throw error;
  }
};

module.exports = {
  sendEmail,
};
