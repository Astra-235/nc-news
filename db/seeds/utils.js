const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};



exports.createLookupTable = (array, key1, key2) => {
  const lookUp ={}
  array.forEach((object)=>{
    lookUp[object[key1]] = object[key2]
})
 
  return lookUp;
};


