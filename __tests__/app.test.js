const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app.js");


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
        for(let i=0; i<topics.length; i++){
        expect(Object.keys(topics[i])).toContain("description");
        expect(Object.keys(topics[i])).toContain("slug");
        }
      });
  });
});
describe("Unrecognised path", () => {
  test("404: Not Found - Responds with `Path not recognised` when there is no endpoint that matches the client's request", () => {
    return request(app)
      .get("/api/NOT-THERE")
      .expect(404)
      .then(({ body: {msg} }) => {
        expect(msg).toBe(`Path not recognised`);
      });
  });
})

describe.only("GET /api/articles/:article_id", () => {
  test("200: Responds with the single article specified by the article_id ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body:{articles} }) => {

        console.log(typeof new Date(1604394720000), '<--- test1')
        console.log(typeof articles.created_at, '<--- test2')

        expect(articles.article_id).toBe(3)
        expect(articles).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: (new Date(1604394720000)).toISOString(),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        // expect(article.author).toBe();
        // expect(article.body).toBe();
        // expect(article.created_at).toBe();
        // expect(article.botes).toBe();
        // expect(article.comment_count).toBe(0);
      });
  });



  test("404: Not Found - responds with message `No article with that article ID` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/24")
      .expect(200)
      .then(({ body: {msg} }) => {
        expect(msg).toBe('No article with that article ID');
  
      });
  });
  test("400: Bad Request - responds with message `Article ID incorrectly entered` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/InCoRrEcT_Id")
      .expect(404)
      .then(({ body: {msg} }) => {
        expect(msg).toBe(`Article ID incorrectly entered`);
  
      });
  });
})

describe("GET /api/articles/", () => {
  test("200: Responds with an array of all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body:{articles} }) => {
        let commentsSummedAcrossArticles = 0
        //correct number of articles
        expect(articles.length).toEqual(data.articleData.length)

        //correct properties in each article
    
        for(let i=0; i<articles.length-1; i++){
          expect(Object.keys(articles[i])).toContain("title");
          expect(Object.keys(articles[i])).toContain("topic");
          expect(Object.keys(articles[i])).toContain("author");
          expect(Object.keys(articles[i])).toContain("created_at");
          expect(Object.keys(articles[i])).toContain("votes");
          expect(Object.keys(articles[i])).toContain("article_img_url");
          expect(Object.keys(articles[i])).toContain("comment_count")

          //article doesn't contain a body property
          expect(Object.keys(articles[i])).not.toContain("body");

          //articles are listed in descending order of date (most recent first)
          expect(Date.parse(articles[i].created_at)).not.toBeLessThan(Date.parse(articles[i+1].created_at))

          //the number of comments are recorded correctly in comment_count
          commentsSummedAcrossArticles += Number(articles[i].comment_count)
          }
          expect(commentsSummedAcrossArticles).toEqual(data.commentData.length)
        

      });
  });
})