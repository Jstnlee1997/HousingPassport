const request = require("supertest");
const app = require("../app");

const validLocalAuthority = "E09000013";

describe("Aggregate Data Of Local Authority", () => {
  it("GET /aggregate/:local-authority should return aggregate data if valid", () => {
    return request(app)
      .get(`/aggregate/${validLocalAuthority}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            "local-authority": validLocalAuthority,
            "current-energy-rating": expect.any(String),
            "current-energy-efficiency": expect.any(String),
          })
        );
      });
  });

  it("GET /aggregate/:local-authority should return 404 if not found", () => {
    return request(app).get("/aggregate/abc").expect(404);
  });
});
