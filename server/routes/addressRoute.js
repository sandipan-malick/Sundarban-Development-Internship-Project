const express = require("express");
const router = express.Router();
const {getAddresses, addAddress, updateAddress, deleteAddress} = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;
