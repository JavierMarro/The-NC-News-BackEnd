const express = require("express");
const router = express.Router();

const {
  deleteComment,
  patchComment,
} = require("../controllers/comments.controllers");

router.patch("/:comment_id", patchComment);

router.delete("/:comment_id", deleteComment);

module.exports = router;
