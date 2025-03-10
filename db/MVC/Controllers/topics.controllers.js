const endpoints = require('../../../endpoints.json')
const fetchTopics = require('../Models/topics.models.js')

const getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics)=>{
    //console.log(rows, '<-- from inside controller')
    res.status(200).send({topics: topics}) 
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports = getTopics

