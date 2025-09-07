const QuizQuestion = require("../models/QuizQuestion");
const QuizAttempt = require("../models/QuizAttempt");

// ===========================
// Public: fetch active quiz questions
// ===========================
exports.getQuiz = async (req, res) => {
  try {
    const { lang = "en", topic } = req.query;
    const filter = { isActive: true, lang };
    if (topic) filter.topic = topic;

    // Select fields excluding correctIndex
    const questions = await QuizQuestion.find(filter)
      .select("question options lang topic difficulty")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    console.error("getQuiz:", err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// ===========================
// Public: submit quiz attempt
// ===========================
exports.submitAttempt = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { answers = [], lang = "en", topic = "general" } = req.body;

    // Get questions referenced by answer questionIds
    const questionIds = answers.map(a => a.questionId);
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

    let score = 0;
    const checkedAnswers = answers.map(a => {
      const question = questions.find(q => q._id.toString() === a.questionId);
      const isCorrect = question && question.correctIndex === a.selectedIndex;
      if (isCorrect) score += 1;

      return {
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correctIndex: question?.correctIndex ?? -1,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      userId,
      lang,
      topic,
      answers: checkedAnswers,
      score,
      total: answers.length,
      submittedAt: new Date(),
    });

    res.status(201).json({
      attempt,
      score,
      total: answers.length,
    });
  } catch (err) {
    console.error("submitAttempt:", err);
    res.status(400).json({ error: "Failed to submit attempt" });
  }
};

// Other admin CRUD methods unchanged...

// ===========================
// Admin: CRUD questions
// ===========================
exports.createQuestion = async (req, res) => {
  try {
    const {
      question,
      options,
      correctIndex,
      lang = "en",
      topic = "general",
      difficulty = "easy",
      isActive = true,
    } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options required" });
    }
    if (correctIndex < 0 || correctIndex >= options.length) {
      return res.status(400).json({ error: "Invalid correctIndex" });
    }

    const newQuestion = await QuizQuestion.create({
      question,
      options,
      correctIndex,
      lang,
      topic,
      difficulty,
      isActive,
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("createQuestion:", err);
    res.status(400).json({ error: "Failed to create question" });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updated = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Question not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateQuestion:", err);
    res.status(400).json({ error: "Failed to update question" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("deleteQuestion:", err);
    res.status(400).json({ error: "Failed to delete question" });
  }
};

// ===========================
// Admin: list attempts / stats
// ===========================
exports.listAttempts = async (req, res) => {
  try {
    const { userId, topic, lang } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (topic) filter.topic = topic;
    if (lang) filter.lang = lang;

    const attempts = await QuizAttempt.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    console.error("listAttempts:", err);
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};
