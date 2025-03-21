const express = require("express");
const router = express.Router();

const { getTopics, addTopic } = require("../controllers/topics.controllers");

router.get("/", getTopics);

router.post("/", addTopic);

module.exports = router;
