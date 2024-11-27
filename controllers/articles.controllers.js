const {
  fetchArticleById,
  fetchAllArticles,
  updatedVotes,
  checkArticleExists,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const updatedBody = req.body.inc_votes;
  const promises = [updatedVotes(updatedBody, article_id)];
  if ((updatedBody, article_id)) promises.push(checkArticleExists(article_id));

  Promise.all(promises)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
