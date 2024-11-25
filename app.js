const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
} = require("./controlers/api.controllers");
const {
  psqlErrorHandler,
  customErrorHandler,
} = require("./error_handlers/api.error.handlers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
