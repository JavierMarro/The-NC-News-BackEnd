const db = require("../db/connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  const validOrder = ["ASC", "DESC"];
  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  let whereSort = " ";
  const queryValues = [];
  if (topic) {
    whereSort = ` WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  let sqlQuery =
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id ` +
    whereSort +
    ` GROUP BY articles.article_id `;

  if ((sort_by, order)) {
    sqlQuery += ` ORDER BY ${sort_by} ${order.toUpperCase()} `;
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id=comments.article_id 
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Article with Id ${article_id} was not found`,
        });
      }
      return rows[0];
    });
};

exports.postArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;

  if (!author || !title || !body || !topic || !article_img_url) {
    return Promise.reject({
      status: 400,
      message: "one of the fields is missing, unable to post article",
    });
  }

  return db
    .query(
      `INSERT INTO articles(title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *, (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) as comment_count`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updatedArticleVotes = (updatedBody, article_id) => {
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
// The model underneath to remove article by id makes sure that comments are deleted first to avoid foreign key constraint errors
exports.removeArticleById = (article_id) => {
  db.query(`DELETE FROM comments WHERE article_id = $1`, [article_id]).then(
    () => {
      return db.query(
        `DELETE FROM articles WHERE article_id = $1 RETURNING *`,
        [article_id]
      );
    }
  );
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Article with Id ${article_id} was not found`,
        });
      }
    });
};
