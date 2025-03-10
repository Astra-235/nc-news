
const handleCustomErrors = (err, req, res, next) => {
    if(err){
    res.status(err.status).send({msg: err.msg})
    }

}

const handleNoEndpoint = (req, res) => {
    res.status(404).send({msg: `Path not recognised`})
}

module.exports = {handleCustomErrors, handleNoEndpoint}