const express = require("express");
const app = express();
const apiRoute = require("./routes/api");
const articlesRoute = require("./routes/articles");
const topicsRoute = require("./routes/topics");
const commentsRoute = require("./routes/comments");
const usersRoute = require("./routes/users");

const {
  psqlErrorHandler,
  customErrorHandler,
} = require("./error_handlers/api.error.handlers");

app.use(express.json());

app.use("/api", apiRoute);

app.use("/api/articles", articlesRoute);

app.use("/api/topics", topicsRoute);

app.use("/api/comments", commentsRoute);

app.use("/api/users", usersRoute);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
