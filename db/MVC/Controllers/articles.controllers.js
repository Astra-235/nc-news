const fetchArticles = require("../Models/articles.models.js")


const getArticles = (req, res, next) => {
    const article_id = req.params.article_id
    fetchArticles(article_id)
    .then((articles)=>{
        res.status(200).send({articles: articles})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = getArticles
