const db = require('../../connection');

const fetchArticles = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((data)=>{
        //console.log(data, '<--- in 111 articles.models')
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