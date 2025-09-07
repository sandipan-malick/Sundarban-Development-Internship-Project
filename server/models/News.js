const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isEmergency: { type: Boolean, default: false }, 
    source: { type: String },
    lang: { type: String, default: "en" },
    topic: { type: String, default: "general" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
