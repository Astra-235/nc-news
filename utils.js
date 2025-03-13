const format = require ("pg-format");
const db = require('./db/connection');

const checkExists = async (table, column, value) => {
    const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
    const dbOutput = await db.query(queryStr, [value]);
    if(dbOutput.rows.length===0)
    //does article exist?
    {return "No_article"} else {return "Article_exists"}
    }

const retrieveComments = () => {
    return db
    .query('SELECT * FROM comments')
    .then(({rows})=>{
        return rows
    })

}


module.exports = {checkExists, retrieveComments}