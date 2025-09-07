const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeItem,
  clearCart,
  confirmOrder,
  getProductHistory,
  getAllOrder,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const { auth } = require("../../client/src/firebase");

// Add to cart
router.post("/product-booking", authMiddleware, addToCart);

// Get cart
router.get("/", authMiddleware, getCart);

// Remove single item
router.delete("/:id", authMiddleware, removeItem);

// Clear cart (all items)
router.delete("/clear/all", authMiddleware, clearCart);

// Confirm order
router.post("/confirm", authMiddleware, confirmOrder);

router.get("/history", authMiddleware, getProductHistory);

router.get("/admin-order", getAllOrder)

module.exports = router;
