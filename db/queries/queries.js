const db = require('../connection');


// Get all of the users (dev database)
db.query("SELECT * FROM users;").then((result)=>console.log(result.rows))

// Get all of the articles where the topic is coding (dev database)
db.query("SELECT * FROM articles;").then((result)=>console.log(result.rows))

// // Get all of the comments where the votes are less than zero (dev database)
// db.query("SELECT * FROM comments WHERE votes<0;").then((result)=>console.log(result.rows))

// // Get all of the topics (dev database)
// db.query("SELECT * FROM topics;").then((result)=>console.log(result.rows))


// // Get all of the articles by user grumpy19 (dev database)
// db.query("SELECT title FROM articles WHERE author='grumpy19';").then((result)=>console.log(result.rows))

// // Get all of the comments that have more than 10 votes. (dev database)
// db.query("SELECT * FROM comments WHERE votes>10;").then((result)=>console.log(result.rows))

