const db = require("../../connection");
const checkExists = require("../../../utils.js");

const fetchComments = (article_id) => {
  

    return db
      .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
      .then(({rows})=>{
        if(rows.length > 0){return rows}
        else {return checkExists("articles", "article_id", article_id)}})
        .then((answer)=>{
        //200: article exists, no comments exist
            if(answer === "Article_exists") {return []}
        //404: article does not exist
            if(answer === "No_article") {return Promise.reject({
                status: 404,
                msg: 'No article with that article ID'
            })}
        //200: article exists, comments exist
            if(answer.length > 0) {return answer}
        })    
     
    }
module.exports = fetchComments;
