const fetchArticles = require("../Models/articles.models.js")


const handlePsqlErrors = (err, req, res, next) => {
    //if the query criterion was was malformed
    if(err.code === '22P02'){
        res.status(400).send({msg: `parameter incorrectly entered`})
    
    //if a foreign key violation, meaning a referenced row does not exist in the referenced table. This error is usually caused by an INSERT or UPDATE statement that references a non-existent row.
    } else if (err.code === '23503'){
        res.status(404).send({msg: `an input field is referencing a non-existent entity e.g.username or article does not exist`})

    //NOT NULL VIOLATION - occurs when a column with a NOT NULL constraint is assigned a NULL value.
    } else if (err.code === '23502'){
        res.status(400).send({msg: `a NULL value has been assigned to a column with a NOT NULL contraint  e.g.no body submitted with a POST request`})
    //path contains query terms which are not recognised by SQL (e.g. 'ASCENDING' rather than 'ASC' when requesting ordered search results)
    } else if (err.code === '42601'){
        res.status(400).send({msg: `syntax error, check query terms are valid`})
    //path contains a query which references a non-existent column in the database tables
    } else if (err.code === '42703'){
        res.status(404).send({msg: `undefined column name`})



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