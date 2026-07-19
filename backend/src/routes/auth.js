const express = require("express");
const router = express.Router();

const { verifyOTP, login, getMe, logout } = require("../controllers/authController");
const { sendOTP } = require("../controllers/otpController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes for the OTP-based authentication flow.
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);

// Protected route to fetch the authenticated user profile.
router.get("/me", authMiddleware, getMe);

module.exports = router;
