const { checkArticleExists } = require("../models/articles.models");
const {
  fetchComments,
  postComment,
  removeCommentById,
  checkCommentExists,
  updatedCommentVotes,
} = require("../models/comments.models");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [fetchComments(article_id)];
  if (article_id) promises.push(checkArticleExists(article_id));

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  const promises = [postComment(newComment, article_id)];
  if (newComment && article_id) promises.push(checkArticleExists(article_id));

  Promise.all(promises)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedBody = req.body.inc_votes;
  const promises = [updatedCommentVotes(updatedBody, comment_id)];
  if ((updatedBody, comment_id)) promises.push(checkCommentExists(comment_id));

  Promise.all(promises)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  if (comment_id)
    checkCommentExists(comment_id)
      .then(() => {
        return removeCommentById(comment_id);
      })
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};
