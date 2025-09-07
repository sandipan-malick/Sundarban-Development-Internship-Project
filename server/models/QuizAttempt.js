// models/QuizAttempt.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizQuestion", required: true },
    selectedIndex: { type: Number, required: true },
    correctIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lang: { type: String, enum: ["en", "bn"], default: "en" },
    topic: { type: String, enum: ["wildlife", "mangrove", "eco-tourism", "general"], default: "general" },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);