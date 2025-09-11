const News = require("../models/News");
// Public: fetch published news
exports.listNews = async (req, res) => {
  try {
    const { lang, topic, emergencyOnly } = req.query;

    const filter = { isPublished: true };
    if (lang) filter.lang = lang;
    if (topic) filter.topic = topic;
    if (emergencyOnly === "true") filter.isEmergency = true;

    const news = await News.find(filter).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error("listNews:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
// Admin: create news
exports.createNews = async (req, res) => {
  try {
    const { title, content, isEmergency = false, source, lang = "en", topic = "general", isPublished = true } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }

    const news = await News.create({
      title,
      content,
      isEmergency,
      source,
      lang,
      topic,
      isPublished,
    });

    res.status(201).json(news);
  } catch (err) {
    console.error("createNews:", err);
    res.status(400).json({ error: "Failed to create news" });
  }
};
// Admin: update news
exports.updateNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "News not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateNews:", err);
    res.status(400).json({ error: "Failed to update news" });
  }
};
// Admin: delete news
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("deleteNews:", err);
    res.status(400).json({ error: "Failed to delete news" });
  }
};
