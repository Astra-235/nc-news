const db = require('../../connection');

const fetchArticles = (article_id) => {


    if(!article_id){
        return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
        .then((data)=>{
            return data.rows
        })
    }


    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((data)=>{
        //if the table does not contain an article with specified ID
           if (data.rows.length === 0) {return Promise.reject({
            status: 200,
            msg: 'No article with that article ID'
        })
        //if the table returns the specified article
        } else {
            return data.rows[0]

        }})

}

module.exports = fetchArticles