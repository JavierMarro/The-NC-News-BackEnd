const db = require("../db/connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC") => {
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id;`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      }
      return rows[0];
    });
};

exports.updatedVotes = (updatedBody, article_id) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [updatedBody, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
