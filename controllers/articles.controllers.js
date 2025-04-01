const {
  fetchArticleById,
  fetchAllArticles,
  updatedArticleVotes,
  checkArticleExists,
  postArticle,
  removeArticleById,
} = require("../models/articles.models");
const { fetchTopicIfSlugExists } = require("../models/topics.models");
//TODO : Implement pagination
exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const promises = [fetchAllArticles(sort_by, order, topic)];
  if (topic) promises.push(fetchTopicIfSlugExists(topic));

  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;
  postArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
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
exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (article_id)
    checkArticleExists(article_id)
      .then(() => {
        return removeArticleById(article_id);
      })
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const updatedBody = req.body.inc_votes;
  const promises = [updatedArticleVotes(updatedBody, article_id)];
  if ((updatedBody, article_id)) promises.push(checkArticleExists(article_id));

  Promise.all(promises)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
