const express = require("express");
const router = express.Router();

const {
  getArticleById,
  getArticles,
  patchArticle,
  addArticle,
} = require("../controllers/articles.controllers");
const {
  getComments,
  addComment,
} = require("../controllers/comments.controllers");

router.get("/", getArticles);
// TODO : make sure the endpoint's MVCs is finished
// TODO : make sure endpoints.json entry is valid line 43
router.post("/", addArticle);

router.get("/:article_id", getArticleById);

router.get("/:article_id/comments", getComments);

router.post("/:article_id/comments", addComment);

router.patch("/:article_id", patchArticle);

module.exports = router;
