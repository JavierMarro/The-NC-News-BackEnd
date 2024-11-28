const express = require("express");
const app = express();
const { getApi } = require("./controllers/api.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers");
const {
  getComments,
  addComment,
  deleteComment,
} = require("./controllers/comments.controllers");
const {
  psqlErrorHandler,
  customErrorHandler,
} = require("./error_handlers/api.error.handlers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
