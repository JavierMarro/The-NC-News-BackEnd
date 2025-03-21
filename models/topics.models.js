const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.postTopic = (topic) => {
  const { slug, description } = topic;

  if (!slug && !description) {
    return Promise.reject({
      status: 400,
      message: "missing fields slug and description",
    });
  }

  if (!slug) {
    return Promise.reject({
      status: 400,
      message: "missing slug, unable to post topic",
    });
  }

  if (!description) {
    return Promise.reject({
      status: 400,
      message: "missing description, unable to post an empty topic",
    });
  }

  return db
    .query(
      `INSERT INTO topics(description, slug) VALUES ($1, $2) RETURNING *`,
      [description, slug]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchTopicIfSlugExists = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      } else {
        return rows[0];
      }
    });
};
