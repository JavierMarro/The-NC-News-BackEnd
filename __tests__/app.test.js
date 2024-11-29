const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

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
  test("200: Responds with an array of all the topics which contains the correct topic data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a single article chosen by Id number", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("400: Responds with an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/sushi-article")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all the articles which contains the correct article data", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
          });
          expect(Number(article.comment_count)).not.toBeNaN();
        });
      });
  });
  test("200: Responds with an array of all the articles default sorted by most recent first", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all the comments according to the article Id provided", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  // test("200: Responds with an empty object it the article Id provided exists but the article has no comments", () => {
  //   return request(app)
  //     .get("/api/articles/2/comments")
  //     .expect(200)
  //     .then(({ body: { comment } }) => {
  //       expect(comment).toHaveLength(0);
  //       expect(comment).toEqual({});
  //     });
  // });
  test("200: Responds with an array of all the comments default sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: Responds with an error message when given an invalid format id", () => {
    return request(app)
      .get("/api/articles/invalidEndpoint/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id for the article", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with a newly created comment object on an article", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .send({
        username: "butter_bridge",
        body: "I am a test comment",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: "I am a test comment",
          article_id: 6,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: Responds with an error message if username is missing", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        body: "I am a test comment",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("missing username, unable to post comment");
      });
  });
  test("400: Responds with an error message if body is missing", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe(
          "missing content, unable to post an empty comment"
        );
      });
  });
  test("400: Responds with an error message if username and body are missing", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("missing fields username and content");
      });
  });
  test("404: Responds with an error message when the user given does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "notUser",
        body: "Test comment",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("User does not exist");
      });
  });
  test("400: Responds with an error message when given an invalid id", () => {
    return request(app)
      .post("/api/articles/newspaper-article/comments")
      .expect(400)
      .send({
        username: "butter_bridge",
        body: "I am a test comment",
      })
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an increased number of votes from the object received", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(10);
      });
  });
  test("200: Responds with a decreased number of votes from the object received", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(90);
      });
  });
  test("400: Responds with an error message if incorrect data type is used for votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "vote" })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/ramen-article")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id for the article", () => {
    return request(app)
      .patch("/api/articles/999")
      .expect(404)
      .send({ inc_votes: 5 })
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Removes the body of the comment selected by its Id", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id for the comment", () => {
    return request(app)
      .delete("/api/comments/300")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("comment not found");
      });
  });
  test("400: Responds with an error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/sorting_queries", () => {
  test("200: accepts a sort_by query which sorts by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: accepts a sort_by query which sorts by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200: accepts a sort_by query which sorts by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: Responds with an array of all the articles sorted by when the article was created", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: accepts a sort_by query which sorts by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: accepts an order query (key created_at as default)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("200: accepts a sort_by query which sorts by key and order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });
  test("400: Responds with an error message if invalid sort_by is used for queries", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidSort")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("400: Responds with an error message if invalid order is used for queries", () => {
    return request(app)
      .get("/api/articles?order=invalidOrder")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/topic_query", () => {
  test("200: accepts a topic query which sorts by the topic selected", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: accepts a topic query which sorts by the topic selected even if there are no articles linked to it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
      });
  });
  test("404: Responds with an error message when given a valid but non-existent topic to sort articles by", () => {
    return request(app)
      .get("/api/articles?topic=invalidTopic")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with a single article chosen by Id number with a comment_count included", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          comment_count: 11,
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

describe("Route not found", () => {
  test("404: request to non-existent route", () => {
    return request(app)
      .get("/request-at-non-existent-path")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});
