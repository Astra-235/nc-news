const fetchArticles = require("../Models/articles.models.js")


const handlePsqlErrors = (err, req, res, next) => {
    //if the query criterion was was malformed
    if(err.code === '22P02'){
        res.status(400).send({msg: `Article ID incorrectly entered`})
    } else {
        next(err)
    }

}



const handleCustomErrors = (err, req, res, next) => {
    res.status(err.status).send({msg: err.msg})
}


const handleNoEndpoint = (req, res) => {
    res.status(404).send({msg: `Path not recognised`})
}




module.exports = {handleCustomErrors, handleNoEndpoint, handlePsqlErrors}