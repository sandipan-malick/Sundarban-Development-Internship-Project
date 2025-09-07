// controllers/authController.js

const User = require("../models/User");
const Otp = require("../models/Otp");
const ResetRequest = require("../models/ResetRequest");
const sendEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");

/**
 * ===============================
 *  AUTH CONTROLLER
 * ===============================
 * Handles: 
 * - Check email availability
 * - Register with OTP
 * - Login with JWT
 * - Forgot password with OTP
 * - Reset password
 * ===============================
 */

//  1. Check if email is available (for registration)
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ error: "Email already registered" });

    return res.json({ message: "Email is available" });
  } catch (err) {
    console.error("Check email error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

//  2. Send OTP (for registration or forgot password)
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Check if email already has a user (for register flow)
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    let existingOtp = await Otp.findOne({ email });
    const now = new Date();

    // If user is banned due to too many attempts
    if (existingOtp?.bannedUntil && existingOtp.bannedUntil > now) {
      return res.status(403).json({ error: "Too many failed attempts. Try again later." });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.otpExpires = otpExpires;
      existingOtp.failedAttempts = 0;
      existingOtp.bannedUntil = null;
      await existingOtp.save();
    } else {
      await Otp.create({ email, otp, otpExpires, failedAttempts: 0, bannedUntil: null });
    }

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}. It expires in 5 minutes.
        Sundarbon Development Team.`);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

//  3. Verify OTP & Register User
exports.verifyOTP = async (req, res) => {
  try {
    const { otp, username, email, password } = req.body;
    if (!otp || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ email });
    if (
      !otpRecord ||
      otpRecord.otp !== String(otp).trim() ||
      otpRecord.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    //  Do NOT hash password here (schema will hash automatically)
    await User.create({ username, email, password });

    // Cleanup OTP
    await Otp.deleteOne({ email });

    // Send success email
    sendEmail(
      email,
      "✅ Registration Successful",
      `Hi ${username}, your registration was successful!
      Sundarbon Development Team`
    ).catch((e) => console.error("Registration email error:", e));

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
};
//  8. Google Register

exports.googleRegister = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists, please login instead." });
    }

    // Create new user
    user = await User.create({
      username: username || email.split("@")[0],
      email,
      password: null, // no password since it's Google
    });
    sendEmail(
      email,
      "✅ Registration Successful",
      `Hi ${username}, your registration was successful!
      Sundarbon Development Team`
    ).catch((e) => console.error("Registration email error:", e));

    res.status(201).json({
      message: "Google registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google register error:", err);
    res.status(500).json({ error: "Server error during Google register" });
  }
};
//  4. Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Optional: send login success email
    sendEmail(
      email,
      "🎉 Login Successful",
      `Hi ${user.username},\n\nYour login was successful!\n\nThanks for joining us.\n\n- Sundarbon Development Team`
    ).catch((err) => console.error("Email error:", err));

    // Send response with cookie + JSON
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 9. Google Login
// 9. Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        username: username || email.split("@")[0],
        email,
        password: null,
        authProvider: "google",
      });
    } else {
      // Upgrade to Google auth if local exists
      if (!user.authProvider || user.authProvider === "local") {
        user.authProvider = "google";
        await user.save();
      }
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Use same cookie config as normal login
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Render/Netlify
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        message: "Google login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Server error during Google login" });
  }
};

//  5. Forgot Password (send OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { email, otp, otpExpires, failedAttempts: 0, bannedUntil: null },
      { upsert: true }
    );

    await sendEmail(email, "🔐 Reset Password OTP", `Your OTP is: ${otp}. Valid for 5 minutes.
        Sundarbon Development Team.`);

    res.status(200).json({ message: "OTP sent for password reset" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  6. Verify Forget Password OTP
exports.verifyForgetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (record.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== String(otp).trim()) {
      record.failedAttempts += 1;
      if (record.failedAttempts >= 5) {
        record.bannedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      await record.save();
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    await Otp.deleteOne({ email });

    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await ResetRequest.findOneAndUpdate(
      { email },
      { email, createdAt: new Date(), expiresAt: resetExpiry },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "OTP verified, proceed to reset password" });
  } catch (err) {
    console.error("Verify Forget OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//  7. Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email & new password required" });
    }

    const resetEntry = await ResetRequest.findOne({ email });
    if (!resetEntry) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    if (resetEntry.expiresAt < new Date()) {
      await ResetRequest.deleteOne({ email });
      return res.status(400).json({ message: "Reset request expired" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❌ Remove manual bcrypt.hash (avoid double hashing)
    user.password = newPassword; // Schema will hash automatically
    await user.save();

    await ResetRequest.deleteOne({ email });

    sendEmail(
      email,
      "✅ Password Changed",
      `Hi, your password was changed successfully.`
    ).catch((e) => console.error("Password change email error:", e));

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// Logout
// controllers/authController.js
exports.logout = (req, res) => {
  try {
    // Clear JWT/auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,     // true if using https (Render, Vercel, etc.)
      sameSite: "none", // must match what you set at login
    });

    // If you are using express-session, clear session cookie too
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Failed to logout" });
  }
};

