// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Import from authController (where you defined everything)
const {
  checkEmail,
  sendOtp,
  verifyOTP,
  login,
  forgotPassword,
  verifyForgetOtp,
  resetPassword,
  googleRegister,
  googleLogin,
  logout
} = require("../controllers/userController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/check-email", checkEmail);
router.post("/send-otp", sendOtp);

// Google
router.post("/google-register", googleRegister);
router.post("/google-login", googleLogin);

// OTP-based register
router.post("/verify-otp", verifyOTP);

// Normal login
router.post("/login", login);

// Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/verify-forget-otp", verifyForgetOtp);
router.post("/reset-password", resetPassword);
// Logout
router.post("/logout", authMiddleware, logout);
module.exports = router;
