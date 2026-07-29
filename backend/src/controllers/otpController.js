const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../helpers/emailHelper");

const sendOTP = async (req, res) => {
  try {
    // Read the incoming email from the request body.
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Normalize the email so lookups are consistent.
    const normalizedEmail = email.toLowerCase().trim();

    // Prevent creating a second account with the same email.
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Generate a fresh, unique 6-digit OTP.
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Remove any older OTPs for the same email before saving a new one.
    await OTP.deleteMany({ email: normalizedEmail, purpose: "signup" });

    // Save the OTP in MongoDB so it can be verified later.
    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: "signup",
    });

    // Send the OTP to the user through Gmail SMTP when credentials are available.
    // If SMTP is not configured yet, the OTP is still saved in MongoDB and printed to the console for local testing.
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Your Reelo OTP Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="margin-bottom: 8px;">Reelo Verification</h2>
            <p style="margin-bottom: 12px;">Use the following one-time password to complete your account setup:</p>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; padding: 16px 0;">${otp}</div>
            <p style="color: #6b7280;">This code is valid for 5 minutes.</p>
          </div>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
        email: normalizedEmail,
      });
    } catch (mailError) {
      console.warn("SMTP unavailable, OTP stored for local testing:", otp);

      return res.status(200).json({
        success: true,
        message: "OTP generated and stored. Configure SMTP to send emails.",
        email: normalizedEmail,
        otp,
      });
    }
  } catch (error) {
    console.error("sendOTP error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};

module.exports = {
  sendOTP,
};
