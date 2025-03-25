const express = require("express");
const router = express.Router();

const {
  getArticleById,
  getArticles,
  patchArticle,
  addArticle,
  deleteArticle,
} = require("../controllers/articles.controllers");
const {
  getComments,
  addComment,
} = require("../controllers/comments.controllers");

router.get("/", getArticles);

router.post("/", addArticle);

router.get("/:article_id", getArticleById);

router.delete("/:article_id", deleteArticle);

router.get("/:article_id/comments", getComments);

router.post("/:article_id/comments", addComment);

router.patch("/:article_id", patchArticle);

module.exports = router;
