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
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("Route not found", () => {
  test("404: request to non-existent route", () => {
    return request(app)
      .get("/apirequestingdata")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route not found");
      });
  });
});
