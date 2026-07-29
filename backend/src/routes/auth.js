const express = require("express");
const router = express.Router();

const { verifyOTP, login, getMe, logout, changePassword, deleteAccount } = require("../controllers/authController");
const { forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/passwordResetController");
const { sendOTP } = require("../controllers/otpController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes for the OTP-based authentication flow.
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// Protected routes for the authenticated user.
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);
router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;
