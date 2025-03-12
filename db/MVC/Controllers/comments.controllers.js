const fetchComments = require("../Models/comments.models.js");
const checkExists = require("../../../utils.js");






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


module.exports = getComments;


