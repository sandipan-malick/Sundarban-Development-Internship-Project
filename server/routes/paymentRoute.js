const express = require("express");
const router = express.Router();
const { getPayment, verifyPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/payment", authMiddleware, getPayment);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;
