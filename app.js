const express = require('express')
const getApiEndpoints = require('./db/MVC/Controllers/api.controllers.js')
const getTopics = require('./db/MVC/Controllers/topics.controllers.js')
const getArticles = require('./db/MVC/Controllers/articles.controllers.js')
const {handleNoEndpoint, handleCustomErrors, handlePsqlErrors} = require('./db/MVC/Controllers/error.controllers.js')

const app = express()


app.get('/api', getApiEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticles)


app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.all('*', handleNoEndpoint)


module.exports = app

