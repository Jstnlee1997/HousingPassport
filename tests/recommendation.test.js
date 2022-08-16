const request = require("supertest");
const app = require("../app");

const validLmkKey = "1573380469022017090821481343938953";

describe("EPC Recommendations", () => {
  it("GET /recommendation/:lmkkey should return all recommendations if valid", () => {
    return request(app)
      .get(`/recommendation/${validLmkKey}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "improvement-id": expect.any(String),
              "improvement-id-text": expect.any(String),
              "improvement-item": expect.any(String),
              "indicative-cost": expect.any(String),
              "lmk-key": validLmkKey,
            }),
          ])
        );
      });
  });

  it("GET /recommendation/:lmkkey should return 404 if not found", () => {
    return request(app).get("/recommendation/abc").expect(404);
  });
});
