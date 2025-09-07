const FAQ = require("../models/FAQ");

// Public
exports.listFAQs = async (req, res) => {
  try {
    const { lang } = req.query;
    const filter = { isPublished: true };
    if (lang) filter.lang = lang;

    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    console.error("listFAQs:", err);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

// Admin
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, lang = "en", isPublished = true } = req.body;
    const faq = await FAQ.create({
      question,
      answer,
      lang,
      isPublished,
    });
    res.status(201).json(faq);
  } catch (err) {
    console.error("createFAQ:", err);
    res.status(400).json({ error: "Failed to create FAQ" });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ error: "Not found" });
    res.json(faq);
  } catch (err) {
    console.error("updateFAQ:", err);
    res.status(400).json({ error: "Failed to update FAQ" });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteFAQ:", err);
    res.status(400).json({ error: "Failed to delete FAQ" });
  }
};
