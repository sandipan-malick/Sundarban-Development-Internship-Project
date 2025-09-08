const express = require("express");
const article = require("../controllers/articleController");
const faq = require("../controllers/faqController");
const quiz = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ---------- Public Routes (No auth for reading) ----------
router.get("/articles", article.listArticles);
router.get("/faqs", faq.listFAQs);
router.get("/quiz", quiz.getQuiz);

// ---------- User Routes (Auth required) ----------
router.post("/quiz/attempt", authMiddleware, quiz.submitAttempt);

// ---------- Admin Routes (Admin auth required) ----------
// Articles
router.post("/admin/articles", adminAuth, article.createArticle);
router.put("/admin/articles/:id", adminAuth, article.updateArticle);
router.delete("/admin/articles/:id", adminAuth, article.deleteArticle);

// FAQs
router.post("/admin/faqs", adminAuth, faq.createFAQ);
router.put("/admin/faqs/:id", adminAuth, faq.updateFAQ);
router.delete("/admin/faqs/:id", adminAuth, faq.deleteFAQ);

// Quiz
router.post("/admin/quiz", adminAuth, quiz.createQuestion);
router.put("/admin/quiz/:id", adminAuth, quiz.updateQuestion);
router.delete("/admin/quiz/:id", adminAuth, quiz.deleteQuestion);
router.get("/admin/quiz/attempts", adminAuth, quiz.listAttempts);

module.exports = router;
