const { checkArticleExists } = require("../models/articles.models");
const { fetchComments, postComment } = require("../models/comments.models");

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
