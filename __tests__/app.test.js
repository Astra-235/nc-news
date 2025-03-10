const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app.js");
/* Set up your test imports here */

beforeAll(() => seed(data));
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

// INSERT INTO table_name (column1, column2, column3, ...)
// VALUES (value1, value2, value3, ...);
// /api/topics.
// [
//   {
//     description: 'The man, the Mitch, the legend',
//     slug: 'mitch',
//     img_url: ""
//   },
//   {
//     description: 'Not dogs',
//     slug: 'cats',
//     img_url: ""
//   },
//   {
//     description: 'what books are made of',
//     slug: 'paper',
//     img_url: ""
//   }
// ];
