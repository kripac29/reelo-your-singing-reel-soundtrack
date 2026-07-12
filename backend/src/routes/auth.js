const express = require("express");
const router = express.Router();

const { signup, verifyOTP, login, getMe } = require("../controllers/authController");
const { sendOTP } = require("../controllers/otpController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes for the OTP-based authentication flow.
router.post("/signup", signup);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// Protected route to fetch the authenticated user profile.
router.get("/me", authMiddleware, getMe);

module.exports = router;