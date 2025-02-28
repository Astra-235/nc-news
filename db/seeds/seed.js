const db = require("../connection")
const format = require("pg-format")
const {convertTimestampToDate, createLookupTable} = require("./utils.js")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles;")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users;")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics;")
  })
  .then(()=>{
    return createTopicsTable()
  })
  .then(()=>{
    return createUsersTable()
  })
  .then(()=>{
    return createArticlesTable()
  })
  .then(()=>{
    return createCommentsTable()
  })
  .then(()=>{
    return insertTopics(topicData)
  })
  .then(()=>{
    return insertUsers(userData)
  })
  .then(()=>{
    return insertArticles(articleData)
  })
  .then(()=>{
    return db.query("SELECT * FROM articles;")
  })
  .then((articlesTable)=>{
    return insertComments(commentData, articlesTable.rows)
  })
}
// return db.query("SELECT * FROM animals;").then((result) => console.log(result))

//db.query("SELECT * FROM articles;").then((result) => console.log(result.rows))

// console.log(result.then((result) => {
//   db.end()
//   return result.rows}))

function createTopicsTable(){
    return db.query(
      `CREATE TABLE topics (
        slug VARCHAR(200) PRIMARY KEY NOT NULL,
        description VARCHAR NOT NULL,
        img_url VARCHAR(1000)
    )`
  )
}

function createUsersTable(){
  return db.query(
    `CREATE TABLE users (
      username VARCHAR(200) PRIMARY KEY NOT NULL,
      name VARCHAR(200) NOT NULL,
      avatar_url VARCHAR(1000)
  )`
)
}

function createArticlesTable(){
  return db.query(
    `CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(1000) REFERENCES topics(slug) NOT NULL,
      author VARCHAR(200) REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
  )`
)
}

function createCommentsTable(){
  return db.query(
    `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(200) REFERENCES users(username) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
  )`
)
}

function insertTopics(topicData){
    const formattedTopics = topicData.map(topic=>{
      return [topic.slug, topic.description, topic.img_url]
    });
    const sqlTopics = format(
      `INSERT INTO topics (slug, description, img_url)
      VALUES %L RETURNING *
      `,
      formattedTopics
    );
    return db.query(sqlTopics)
}

function insertUsers(userData){
  const formattedUsers = userData.map(user=>{
    return [user.username, user.name, user.avatar_url]
  });
  const sqlUsers = format(
    `INSERT INTO users (username, name, avatar_url)
    VALUES %L RETURNING *
    `,
    formattedUsers
  );
  return db.query(sqlUsers)
}

function insertArticles(articleData){
  const formattedArticles = articleData.map(article=>{
    const created_atUnixFormat = article.created_at
    const created_atSQLFormat = convertTimestampToDate(created_atUnixFormat).created_at
    return [article.title, article.topic, article.author, article.body, created_atSQLFormat, article.votes, article.article_img_url]
  });
  const sqlArticles = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
    VALUES %L RETURNING *
    `,
    formattedArticles
  );
  return db.query(sqlArticles)
}

function insertComments(commentData, articlesTable){

  const lookUp = createLookupTable(articlesTable, 'title', 'article_id')
  
  const formattedComments = commentData.map(comment=>{
    //convert article.created_at timestamp from Unix format to SQL format
    const created_atUnixFormat = comment.created_at
    const created_atSQLFormat = convertTimestampToDate(created_atUnixFormat).created_at

    //lookup comment.article_title in a lookup table and retrieve the corresponding article_id
    const articleID = lookUp[comment.article_title]

    return [articleID, comment.body, comment.votes, comment.author, created_atSQLFormat]
  });
  const sqlComments = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at)
    VALUES %L RETURNING *
    `,
    formattedComments
  );
  return db.query(sqlComments)
}


module.exports = seed;
