const {fetchComments, addComments} = require("../Models/comments.models.js");



 

const postComments = (req, res, next) => {

  const article_id = req.params.article_id
  const username = req.body.username
  const comment = req.body.body

  addComments(article_id, username, comment)
  .then((data)=>{
    console.log(data, '<--- data in comments.controllers')
    res.status(200).send({comment: data})
    
  })
  .catch((err)=>{
    console.log(err, '<--- err in comments.controllers')
    next(err)
  })



}



const getComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchComments(article_id)
  .then((comments)=>{
    res.status(200).send({comments: comments})
  })
  .catch((err)=>{
    next(err)
  })

}


module.exports = {getComments, postComments};


