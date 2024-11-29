const express = require("express");
const router = express.Router();

const { getApi } = require("../controllers/api.controllers");

router.get("/", getApi);

module.exports = router;
