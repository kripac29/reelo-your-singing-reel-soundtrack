const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");

const generateToken = (user) => {
  // Create a signed JWT with the authenticated user ID and email.
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "reelo-dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const verifyOTP = async (req, res) => {
  try {
    // Read the verification payload.
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Ensure the user does not already exist before creating one.
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Find the latest OTP entry for this email.
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash the password and create the authenticated user.
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: true,
    });

    // Remove all OTP records for that email after successful verification.
    await OTP.deleteMany({ email: normalizedEmail });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please sign in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("verifyOTP error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Retrieve the user record by email.
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the incoming password with the hashed password stored in MongoDB.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load user profile",
    });
  }
};

const logout = async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  verifyOTP,
  login,
  getMe,
  logout,
};
