const fetchArticles = require("../Models/articles.models.js")


const getArticles = (req, res, next) => {
    const article_id = req.params.article_id
    fetchArticles(article_id)
    .then((article)=>{
        //console.log(article, '<--- in articles.controllers')
        res.status(200).send({article: article})
    })
    .catch((err)=>{
        console.log(err, '<--- in 333 articles.controllers')
        next(err)
    })
}

module.exports = getArticles
