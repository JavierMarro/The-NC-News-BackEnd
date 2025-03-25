const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  return db
    .query(
      `SELECT * from comments
      WHERE article_id = $1
      ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      } else {
        return rows;
      }
    });
};

exports.postComment = (comment, article_id) => {
  const { username, body } = comment;

  if (!username && !body) {
    return Promise.reject({
      status: 400,
      message: "missing fields username and content",
    });
  }

  if (!username) {
    return Promise.reject({
      status: 400,
      message: "missing username, unable to post comment",
    });
  }

  if (!body) {
    return Promise.reject({
      status: 400,
      message: "missing content, unable to post an empty comment",
    });
  }

  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Comment with Id ${comment_id} was not found`,
        });
      }
    });
};
