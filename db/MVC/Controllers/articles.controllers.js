const {
  fetchSingleArticle,
  patchArticleVotes,
  fetchAllArticles,
} = require("../Models/articles.models.js");
const format = require("pg-format");

const patchArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  const inc_votes = req.body.inc_votes;
  patchArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const article_id = req.params.article_id;

  //extracts a 'queries' object containing all the query fields that have been entered
  const queries = {};
  const queryCategories = Object.keys(req.query);
  const queryValues = Object.values(req.query);
  for (let i = 0; i < queryCategories.length; i++) {
    queries[queryCategories[i]] = queryValues[i];
  }

  //if a specific article is requested
  if (article_id) {
    fetchSingleArticle(article_id)
      .then((article) => {
        res.status(200).send({ articles: article });
      })
      .catch((err) => {
        next(err);
      });
  }

  //if a all articles are requested
  if (!article_id) {
    //enters the sort_by field, and the order (ASC/DESC) into the database query; defaults to 'created_at' and 'DESC' respectively if these fields are left blank by the client
    let sortBy;
    let sortOrder;
    if (queries.sort_by) {
      sortBy = queries.sort_by;
    } else {
      sortBy = "created_at";
    }
    if (queries.order) {
      sortOrder = queries.order;
    } else {
      sortOrder = "DESC";
    }
    let fetchquery
    if(queries.topic){
      fetchquery = format(
        "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = %L GROUP BY articles.article_id ORDER BY %I %s",
        queries.topic,
        sortBy,
        sortOrder)
    } else {
      fetchquery = format(
        "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY %I %s",
        sortBy,
        sortOrder)
    };
    //if a topic condition has been included by client, then filter articles by this topic
     fetchAllArticles(fetchquery)
      .then((articles) => {
        res.status(200).send({ articles: articles });
      })
      .catch((err) => {
        next(err);
      });
  }
};



module.exports = { getArticles, patchArticle };

