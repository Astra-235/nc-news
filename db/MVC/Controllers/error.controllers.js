
const handleCustomErrors = (err, req, res, next) => {
   
    res.status(err.status).send({msg: err.msg})
    }



const handleNoEndpoint = (req, res) => {
    res.status(404).send({msg: `Path not recognised`})
}

const handlePsqlErrors = (err, req, res, next) => {
    //if the ID was malformed
    if(err.code === '22P02'){
        console.log(err, '<--- in 444 errors.controllers')
        res.status(404).send({msg: `Article ID incorrectly entered - must be an integer`})
    } else {
        next(err)
    }

}


module.exports = {handleCustomErrors, handleNoEndpoint, handlePsqlErrors}