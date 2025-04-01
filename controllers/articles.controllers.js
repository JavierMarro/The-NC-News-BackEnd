const {
  fetchArticleById,
  fetchAllArticles,
  updatedArticleVotes,
  checkArticleExists,
  postArticle,
  removeArticleById,
  fetchTotalArticles,
} = require("../models/articles.models");
const { fetchTopicIfSlugExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit = 10, p = 1 } = req.query;
  const limitNum = Number(limit);
  const page = Number(p);
  if (isNaN(limitNum) || limitNum < 1 || isNaN(page) || page < 1) {
    return next({
      status: 400,
      message: "Invalid values, input must be a positive integer",
    });
  }

  const promises = [
    fetchAllArticles(sort_by, order, topic, limitNum, page),
    fetchTotalArticles(topic),
  ];
  if (topic) promises.push(fetchTopicIfSlugExists(topic));

  Promise.all(promises)
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
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
