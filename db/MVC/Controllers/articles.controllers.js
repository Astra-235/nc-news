const {fetchArticles, patchArticleVotes} = require("../Models/articles.models.js")


const patchArticle = (req, res, next) => {
    const article_id = req.params.article_id
    const inc_votes = req.body.inc_votes
    patchArticleVotes(article_id, inc_votes)
    .then((article)=>{
        res.status(200).send({article: article})
    })
    .catch((err)=>{
        console.log(err, '<err in articles.controller')
        next(err)
    })
}



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

module.exports = {getArticles, patchArticle}
