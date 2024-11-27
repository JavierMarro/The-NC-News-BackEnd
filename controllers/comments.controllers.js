const { fetchComments, postComment } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  postComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
