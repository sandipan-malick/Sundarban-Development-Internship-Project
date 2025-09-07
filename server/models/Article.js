const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    lang: { type: String, enum: ["en", "bn"], default: "en" }, // English / Bengali
    topic: { type: String, enum: ["wildlife", "mangrove", "eco-tourism", "general"], default: "general" },
    coverImage: { type: String },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
