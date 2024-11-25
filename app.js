const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controlers/api.controllers");
const { customErrorHandler } = require("./error_handlers/api.error.handlers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

app.use(customErrorHandler);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;