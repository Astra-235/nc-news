const express = require('express')
const getApiEndpoints = require('./db/MVC/Controllers/api.controllers.js')
const getTopics = require('./db/MVC/Controllers/topics.controllers.js')
const {handleNoEndpoint, handleCustomErrors} = require('./db/MVC/Controllers/error.controllers.js')

const app = express()



app.get('/api', getApiEndpoints)



app.get('/api/topics', getTopics)



app.use(handleCustomErrors)



app.all('*', handleNoEndpoint)



module.exports = app