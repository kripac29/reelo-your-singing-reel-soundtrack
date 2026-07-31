const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { error } = await resend.emails.send({
    from: "Reelo <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

module.exports = {
  sendEmail,
};
