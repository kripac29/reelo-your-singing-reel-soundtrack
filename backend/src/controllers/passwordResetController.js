const crypto = require("crypto");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendEmail } = require("../helpers/emailHelper");

const resetOtpPurpose = "password-reset";
const genericSendResponse = {
  success: true,
  message: "If an account exists for this email, a verification code has been sent.",
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(200).json(genericSendResponse);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await OTP.deleteMany({ email: normalizedEmail, purpose: resetOtpPurpose });
    await User.updateOne(
      { _id: user._id },
      { $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 } },
    );
    await OTP.create({ email: normalizedEmail, otp, purpose: resetOtpPurpose });

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Reset your Reelo password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="margin-bottom: 8px;">Reset your password</h2>
            <p style="margin-bottom: 12px;">Use this verification code to reset your Reelo password:</p>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; padding: 16px 0;">${otp}</div>
            <p style="color: #6b7280;">This code expires in 5 minutes. If you did not request a password reset, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Unable to send password reset email:", mailError.message);
      await OTP.deleteMany({ email: normalizedEmail, purpose: resetOtpPurpose });
      return res.status(503).json({ success: false, message: "Unable to send verification code. Please try again later." });
    }

    return res.status(200).json(genericSendResponse);
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ success: false, message: "Unable to send verification code" });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and verification code are required" });

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp, purpose: resetOtpPurpose }).sort({ createdAt: -1 });
    if (!otpRecord) return res.status(400).json({ success: false, message: "Invalid or expired code" });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired code" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await OTP.deleteMany({ email: normalizedEmail, purpose: resetOtpPurpose });

    return res.status(200).json({ success: true, message: "Code verified", resetToken });
  } catch (error) {
    console.error("verifyResetOtp error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify code" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;
    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Email, reset authorization and both passwords are required" });
    }
    if (newPassword !== confirmPassword) return res.status(400).json({ success: false, message: "Passwords do not match" });
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
    }

    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpiresAt");
    if (!user) return res.status(400).json({ success: false, message: "Reset authorization is invalid or expired" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ success: false, message: "Unable to reset password" });
  }
};

module.exports = { forgotPassword, verifyResetOtp, resetPassword };
