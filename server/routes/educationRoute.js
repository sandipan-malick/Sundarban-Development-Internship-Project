const express = require("express");
const article = require("../controllers/articleController");
const faq = require("../controllers/faqController");
const quiz = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- Public ----------
router.get("/articles",authMiddleware, article.listArticles);
router.get("/faqs", authMiddleware, faq.listFAQs);
router.get("/quiz", authMiddleware, quiz.getQuiz);
router.post("/quiz/attempt", authMiddleware, quiz.submitAttempt);

// ---------- Admin (Articles) ----------
router.post("/admin/articles",  article.createArticle);
router.put("/admin/articles/:id", article.updateArticle);
router.delete("/admin/articles/:id", article.deleteArticle);

// ---------- Admin (FAQs) ----------
router.post("/admin/faqs",  faq.createFAQ);
router.put("/admin/faqs/:id",   faq.updateFAQ);
router.delete("/admin/faqs/:id",  faq.deleteFAQ);

// ---------- Admin (Quiz) ----------
router.post("/admin/quiz",  quiz.createQuestion);
router.put("/admin/quiz/:id", quiz.updateQuestion);
router.delete("/admin/quiz/:id",  quiz.deleteQuestion);
router.get("/admin/quiz/attempts",  quiz.listAttempts);

module.exports = router;
