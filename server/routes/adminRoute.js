const express = require("express");
const router = express.Router();
const {getAllBookings, getAllConfirmedBookings, getAllAddresses} = require("../controllers/adminController");
const { loginAdmin, logoutAdmin } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.get("/bookings", getAllBookings);

// Fetch all confirmed bookings
router.get("/confirmed", getAllConfirmedBookings);

// Fetch all addresses
router.get("/addresses", getAllAddresses);

router.post("/login", loginAdmin);
// Admin logout
router.post("/logout", adminAuth, logoutAdmin);

module.exports = router;
