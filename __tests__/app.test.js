const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app.js");
/* Set up your test imports here */

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds an array of all the topics, with each topic containing only two properties: the slug and the description ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toEqual(data.topicData.length);
        expect(Object.keys(topics[0]).length).toBe(2);
        expect(Object.keys(topics[0])).toContain("description");
        expect(Object.keys(topics[0])).toContain("slug");
      });
  });
  test("200: Responds with a message if no information in the table: `There are currently no existing topics` ", () => {
    return db
      .query(`DELETE FROM comments;`)
      .then(() => {
        return db.query(`DELETE FROM articles;`);
      })
      .then(() => {
        return db.query(`DELETE FROM topics;`).then(() => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.msg).toBe("There are currently no existing topics");
            });
        });
      });
  });
});
describe("Unrecognised path", () => {
  test("404: Responds with `Path not recognised` when there is no endpoint that matches the client's request", () => {
    return request(app)
      .get("/api/NOT-THERE")
      .expect(404)
      .then(({ body: {msg} }) => {
        console.log(msg, '<--- test')
        expect(msg).toBe(`Path not recognised`);
      });
  });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the single article specified by the article_id ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body:{article} }) => {
        expect(Object.keys(article).length).toBe(8);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.votes).toBe(0);
      });
  });
  test("200: responds with message `No article with that article ID` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/24")
      .expect(200)
      .then(({ body: {msg} }) => {
        console.log(msg, '<-- in test')
        expect(msg).toBe('No article with that article ID');
  
      });
  });
  test("200: responds with message `Article ID incorrectly entered - must be an integer` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/InCoRrEcT_Id")
      .expect(404)
      .then(({ body: {msg} }) => {
        //console.log(msg, '<-- in test')
        expect(msg).toBe(`Article ID incorrectly entered - must be an integer`);
  
      });
  });
})
