const db = require('../connection');



// // Get all of the topics(dev database)
// db.query("SELECT * FROM topics;").then((result)=>console.log(result.rows))


// // Get all of the users (dev database)
// db.query("SELECT * FROM users;").then((result)=>console.log(result.rows))

// // Get all of the articles where the topic is coding (dev database)
db.query("SELECT * FROM articles;").then((result)=>console.log(result.rows))

// Get all of the comments (dev database)
db.query("SELECT * FROM comments;").then((result)=>console.log(result.rows))

