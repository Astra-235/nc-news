const {fetchUsers} = require("../Models/users.models.js");


const getUsers = (req, res, next) => {
    fetchUsers()
  .then((users)=>{
    res.status(200).send({users: users})
  })
}

module.exports = {getUsers}