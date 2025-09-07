const express = require("express");
const router = express.Router();
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Public - get all products
router.get("/", authMiddleware, listProducts);

// Admin - manage products
router.post("/", createProduct);
router.put("/id", updateProduct);
router.delete("/", deleteProduct);

module.exports = router;
