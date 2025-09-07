const express = require("express");
const router = express.Router();
const {
  listNews,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");

// Public
router.get("/", listNews);

// Admin
router.post("/", createNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

module.exports = router;
