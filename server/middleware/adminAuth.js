const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Middleware to verify admin
const adminAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminAuth;
