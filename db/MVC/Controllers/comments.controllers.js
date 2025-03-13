const {fetchComments, addComments, deleteCommentById} = require("../Models/comments.models.js");


const deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id
  deleteCommentById(comment_id)
  .then((deleteData)=>{
    //comment was not deleted as did not exist
    if(deleteData.rowCount === 0){return Promise.reject({
      status: 404,
      msg: `an input field is referencing a non-existent entity e.g.username or article does not exist`
    })
    }
    //comment was deleted
    else if(deleteData.rowCount === 1)
    {res.status(204).send()}
  })
  .catch((err)=>{
    next(err)
  })
}
 

const postComments = (req, res, next) => {

  const article_id = req.params.article_id
  const username = req.body.username
  const comment = req.body.body

  addComments(article_id, username, comment)
  .then((data)=>{
    res.status(200).send({comment: data})
    
  })
  .catch((err)=>{
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


module.exports = {getComments, postComments, deleteComment};


