const db = require('../../connection');

const fetchTopics = () => {
    return db.
    query('SELECT slug, description FROM topics')
    .then(({rows}) => {
        if(rows.length === 0){return Promise.reject({
            status:200,
            msg: "There are currently no existing topics"
        })}
        else return rows
    })


}


module.exports = fetchTopics