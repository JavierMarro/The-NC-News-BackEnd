const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
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
