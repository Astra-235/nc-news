const express = require('express')
const getApiEndpoints = require('./db/MVC/Controllers/api.controllers.js')

const app = express()

app.get('/api', getApiEndpoints)


module.exports = app