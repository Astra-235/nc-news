const cors = require('cors')
const express = require('express')
const getApiEndpoints = require('./db/MVC/Controllers/api.controllers.js')
const getTopics = require('./db/MVC/Controllers/topics.controllers.js')
const {getArticles, patchArticle} = require('./db/MVC/Controllers/articles.controllers.js')
const {getComments, postComments, deleteComment} = require('./db/MVC/Controllers/comments.controllers.js')
const {handleNoEndpoint, handleCustomErrors, handlePsqlErrors} = require('./db/MVC/Controllers/error.controllers.js')
const {getUsers} = require('./db/MVC/Controllers/users.controllers.js')



const app = express()

app.use(express.json())
app.use(cors());


//endpoints
app.get('/api', getApiEndpoints)
//topics
app.get('/api/topics', getTopics)
//articles
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticles)
app.patch('/api/articles/:article_id', patchArticle)
//comments
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComments)
app.delete('/api/comments/:comment_id', deleteComment)
//users
app.get('/api/users', getUsers)

//error handling
app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.all('*', handleNoEndpoint)


module.exports = app

