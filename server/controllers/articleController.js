const Article = require("../models/Article");

// Public
exports.listArticles = async (req, res) => {
  try {
    const { lang, topic, q } = req.query;
    const filter = { isPublished: true };
    if (lang) filter.lang = lang;
    if (topic) filter.topic = topic;
    if (q) filter.title = { $regex: q, $options: "i" };

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error("listArticles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// Admin
exports.createArticle = async (req, res) => {
  try {
    const { title, content, lang = "en", topic = "general", coverImage, isPublished = true } = req.body;
    const article = await Article.create({
      title,
      content,
      lang,
      topic,
      coverImage,
      isPublished,
    });
    res.status(201).json(article);
  } catch (err) {
    console.error("createArticle:", err);
    res.status(400).json({ error: "Failed to create article" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const article = await Article.findByIdAndUpdate(id, update, { new: true });
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch (err) {
    console.error("updateArticle:", err);
    res.status(400).json({ error: "Failed to update article" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findByIdAndDelete(id);
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteArticle:", err);
    res.status(400).json({ error: "Failed to delete article" });
  }
};
