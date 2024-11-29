const express = require("express");
const router = express.Router();

const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("../controllers/articles.controllers");
const {
  getComments,
  addComment,
} = require("../controllers/comments.controllers");

router.get("/", getArticles);

router.get("/:article_id", getArticleById);

router.get("/:article_id/comments", getComments);

router.post("/:article_id/comments", addComment);

router.patch("/:article_id", patchArticle);

module.exports = router;
