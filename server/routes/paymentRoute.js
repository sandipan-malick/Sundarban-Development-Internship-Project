const express = require("express");
const router = express.Router();
const { getPayment, verifyPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, getPayment);

module.exports = router;
