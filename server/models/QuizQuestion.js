const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: [(arr) => arr.length >= 2, "At least 2 options required"],
      required: true,
    },
    correctIndex: { type: Number, required: true, min: 0 },
    lang: { type: String, enum: ["en", "bn"], default: "en" },
    topic: { type: String, enum: ["wildlife", "mangrove", "eco-tourism", "general"], default: "general" },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);
