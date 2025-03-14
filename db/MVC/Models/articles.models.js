const db = require("../../connection");
const format = require("pg-format");

const patchArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
        SET
          votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      //400: inc_votes not send as part of patch request
      if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: `inc_votes missing from patch request`,
        });
      }
      //404: specified article does not exist
      else if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `an input field is referencing a non-existent entity e.g.username or article does not exist`,
        });
      } else {
        //200: an article was found
        return rows[0];
      }
    });
};




const fetchAllArticles = (fetchquery) => {
  return db.query(fetchquery)
  .then(({ rows }) => {
    return rows;
  });
};



const fetchSingleArticle = (article_id) => {
  return db
    .query("SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [article_id])
    .then(({rows}) => {
       //if the table does not contain an article with specified ID
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article with that article ID",
        });
        //if the table returns the specified article
      } else {
        return rows[0];
      }
    });
};

module.exports = { fetchAllArticles, fetchSingleArticle, patchArticleVotes };

