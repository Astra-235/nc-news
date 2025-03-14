const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app.js");
const { retrieveComments } = require("../utils.js");
const { addComments } = require("../db/MVC/Models/comments.models.js");

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
        for (let i = 0; i < topics.length; i++) {
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Path not recognised`);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the single article specified by the article_id ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.article_id).toBe(3);
        expect(articles).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: new Date(1604394720000).toISOString(),
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
      .get("/api/articles/34")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article with that article ID");
      });
  });
  test("400: Bad Request - responds with message `Article ID incorrectly entered` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/InCoRrEcT_Id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`parameter incorrectly entered`);
      });
  });
});

describe("GET /api/articles/", () => {
  test("200: Responds with an array of all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        let commentsSummedAcrossArticles = 0;
        //correct number of articles
        expect(articles.length).toEqual(data.articleData.length);

        //correct properties in each article

        for (let i = 0; i < articles.length - 1; i++) {
          expect(Object.keys(articles[i])).toContain("title");
          expect(Object.keys(articles[i])).toContain("topic");
          expect(Object.keys(articles[i])).toContain("author");
          expect(Object.keys(articles[i])).toContain("created_at");
          expect(Object.keys(articles[i])).toContain("votes");
          expect(Object.keys(articles[i])).toContain("article_img_url");
          expect(Object.keys(articles[i])).toContain("comment_count");

          //article doesn't contain a body property
          expect(Object.keys(articles[i])).not.toContain("body");

          //articles are listed in descending order of date (most recent first)
          expect(Date.parse(articles[i].created_at)).not.toBeLessThan(
            Date.parse(articles[i + 1].created_at)
          );

          //the number of comments are recorded correctly in comment_count
          commentsSummedAcrossArticles += Number(articles[i].comment_count);
        }
        expect(commentsSummedAcrossArticles).toEqual(data.commentData.length);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all the comments for the specified article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        //correct properties in each article
        for (let i = 0; i < comments.length - 1; i++) {
          expect(Object.keys(comments[i])).toContain("comment_id");
          expect(Object.keys(comments[i])).toContain("votes");
          expect(Object.keys(comments[i])).toContain("created_at");
          expect(Object.keys(comments[i])).toContain("author");
          expect(Object.keys(comments[i])).toContain("body");
          expect(Object.keys(comments[i])).toContain("article_id");

          //articles are listed in descending order of date (most recent first)
          expect(Date.parse(comments[i].created_at)).not.toBeLessThan(
            Date.parse(comments[i + 1].created_at)
          );

          //all returned comments are for the specified article ID
          expect(comments[i].article_id).toBe(1);
        }
      });
  });
  test("400: if a non-integer value is entered for the article_id, an error message is returned", () => {
    return request(app)
      .get("/api/articles/SwissCheese/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`parameter incorrectly entered`);
      });
  });

  test("404: Not Found - responds with message `No article with that article ID` when no article with specified ID exists on the database", () => {
    return request(app)
      .get("/api/articles/101/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article with that article ID");
      });
  });

  test("200: returns an empty array when passed an existing article_id that has no comments attributed to it", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200: correctly posts a comment and attributes it with the next available comment_id when imputted with an existing article_id, an existing username, and a string-formatted body", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge",
        body: "this is a prime example",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.article_id).toBe(5);
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("this is a prime example");

        expect(body.comment.comment_id).toBe(data.commentData.length + 1);
      });
  });

  test("400: a non-integer value was entered for article_id ", () => {
    return request(app)
      .post("/api/articles/blueCheese/comments")
      .send({
        username: "butter_bridge",
        body: "this is a prime example",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`parameter incorrectly entered`);
      });
  });

  test("404: username not found", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "butter_bridge_COLLAPSE",
        body: "this is a prime example",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `an input field is referencing a non-existent entity e.g.username or article does not exist`
        );
      });
  });

  test("404: article not found", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        username: "butter_bridge",
        body: "this is a prime example",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `an input field is referencing a non-existent entity e.g.username or article does not exist`
        );
      });
  });

  test("400: body not submitted with POST request", () => {
    return request(app)
      .post("/api/articles/8/comments")
      .send({
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `a NULL value has been assigned to a column with a NOT NULL contraint  e.g.no body submitted with a POST request`
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: takes an article, specified by ID, ammends the number of votes by a given amount, and returns the newly-ammended article", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({
        inc_votes: 12,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(7);
        expect(article.votes).toBe(12);
        expect(Object.keys(article)).toContain("title");
        expect(Object.keys(article)).toContain("topic");
        expect(Object.keys(article)).toContain("title");
        expect(Object.keys(article)).toContain("author");
        expect(Object.keys(article)).toContain("body");
        expect(Object.keys(article)).toContain("created_at");
        expect(Object.keys(article)).toContain("article_img_url");
      });
  });

  test("400: a non-integer value was entered for article_id ", () => {
    return request(app)
      .patch("/api/articles/blueCheese")
      .send({
        inc_votes: 12,
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`parameter incorrectly entered`);
      });
  });

  test("404: article not found", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({
        inc_votes: 12,
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          `an input field is referencing a non-existent entity e.g.username or article does not exist`
        );
      });
  });

  test("400: inc_votes not included in body of patch", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`inc_votes missing from patch request`);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: if comment with specified id exists in comments table, then  deletes it from the table; no content is returned", () => {
    return request(app)
      .delete("/api/comments/7")
      .expect(204)
      .then(({ body }) => {
        //the body returned by the server is an empty object
        expect(body).toEqual({});
      })
      .then(() => {
        return retrieveComments();
      })
      .then((comments) => {
        //the total number of comments should now be one less than in the original data set
        expect(comments.length).toBe(data.commentData.length - 1);
      });
  });
  test("404: comment not found", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          `an input field is referencing a non-existent entity e.g.username or article does not exist`
        );
      });
  });

  test("400: a non-integer value was entered for comment_id ", () => {
    return request(app)
      .delete("/api/comments/blueCheese")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`parameter incorrectly entered`);
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        for (let i = 0; i < users.length; i++) {
          //return information has the right properties
          expect(Object.keys(users[i])).toContain("username");
          expect(Object.keys(users[i])).toContain("name");
          expect(Object.keys(users[i])).toContain("avatar_url");
          //number of returned users is equal to the number of users in the test data set
          expect(users.length).toBe(data.userData.length);
        }
      });
  });
});

describe("GET /api/articles?sort_by=[field]", () => {
  test("200: returns an array of all the articles sorted by topic  descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=DESC")
      .expect(200)
      .then(({ body: { articles } }) => {
        for (let i = 0; i < articles.length - 1; i++) {
          {
            expect(articles[i].topic.charCodeAt(0)).not.toBeLessThan(
              articles[i + 1].topic.charCodeAt(0)
            );
          }
        }
      });
  });

  test("200: returns an array of all the articles sorted by title  ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        for (let i = 0; i < articles.length - 1; i++) {
          {
            expect(articles[i].title.charCodeAt(0)).not.toBeGreaterThan(
              articles[i + 1].title.charCodeAt(0)
            );
          }
        }
      });
  });

  test("200: returns an array of all the articles, default sorted by created_at, in ascending order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        for (let i = 0; i < articles.length - 1; i++) {
          expect(Date.parse(articles[i].created_at)).not.toBeGreaterThan(
            Date.parse(articles[i + 1].created_at)
          );
        }
      });
  });

  test("400: returns an error message if the 'order' term is neither ASC nor DESC", () => {
    return request(app)
      .get("/api/articles?order=XXX")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`syntax error, check query terms are valid`);
      });
  });

  test("404: returns an error message if client tries to sort_by a non-existent column name", () => {
    return request(app)
      .get("/api/articles?sort_by=sauce")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`undefined column name`);
      });
  });

  test("200: if client makes a query other than 'sort_by' (e.g. 'arrange_by') then the query is ignored, and sorting defaults to created_at DESC", () => {
    return request(app)
      .get("/api/articles?arrange_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        for (let i = 0; i < articles.length - 1; i++) {
          expect(Date.parse(articles[i].created_at)).not.toBeLessThan(
            Date.parse(articles[i + 1].created_at)
          );
        }
      });
  });
});

describe("GET /api/articles?topic=[field]", () => {
  test("200: filters the articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        for(let i=0; i<articles.length; i++){
          expect(articles[i].topic).toBe('mitch')
        }
      })
  });
  test("200: querying by a column name other than 'topic' defaults to returning all the articles", () => {
    return request(app)
      .get("/api/articles?title=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(data.articleData.length)
      })
  });
  test("200: querying by a topic that doesn't exist returns an empty array", () => {
    return request(app)
      .get("/api/articles?topic=helsinki")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0)
      })
  });
})

describe("GET /api/articles:article_id", () => {
  test("200: returned article includes a comment count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { articles } }) => {
        console.log(articles, 'VVV')
        expect(Object.keys(articles)).toContain("comment_count");
      })
      })
  });
