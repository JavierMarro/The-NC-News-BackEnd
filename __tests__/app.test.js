// contains static data
const endpointsJson = require("../endpoints.json");
// allows endpoint connections, supertest provides its own listeners when running tests
const request = require("supertest");
const app = require("../app");
// sample data provided for testing and seed to be populated with such data
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
// database connection pool for ending connection after tests run
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
