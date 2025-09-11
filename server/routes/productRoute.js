const express = require("express");
const router = express.Router();
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

// Public - Get all products (no auth required)
router.get("/", listProducts);

// Admin - Manage products (protected)
router.post("/", adminAuth, createProduct);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;
