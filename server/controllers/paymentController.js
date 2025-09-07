const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.getPayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // convert rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment order creation failed" });
  }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // ✅ Payment verified
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error in payment verification" });
  }
};
