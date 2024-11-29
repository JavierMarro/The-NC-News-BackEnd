const express = require("express");
const router = express.Router();

const { getTopics } = require("../controllers/topics.controllers");

router.get("/", getTopics);

module.exports = router;
