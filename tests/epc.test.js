const request = require("supertest");
const app = require("../app");

describe("EPC Certificates", () => {
  it("GET /epc/:lmkkey should return certificate if valid", () => {
    return request(app)
      .get(
        "/epc/1e087cfceb2b4e4cf113af8991c2775332cf8dfdb9ceec8bbc18540c9eb2011f"
      )
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("lmk-key");
      });
  });

  it("GET /epc/:lmkkey should return 404 if not found", () => {
    return request(app).get("/epc/abc").expect(404);
  });

  it("GET /epc/postcode/:postcode should return certificate", () => {
    return request(app)
      .get("/epc/postcode/sw67sr")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body[0]).toHaveProperty("lmk-key");
      });
  });

  it("GET /epc/postcode/:postcode should return 404 if not found", () => {
    return request(app).get("/epc/postcode/123").expect(404);
  });
});

describe("EPC Recommendations", () => {
  it("GET /recommendation/:lmkkey should return all recommendations if valid", () => {
    return request(app)
      .get("/recommendation/1573380469022017090821481343938953")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        // expect(res.body.length).toBeGreaterThan(0);
        // console.log(res.body);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              "improvement-descr-text": expect.any(String),
              "improvement-id": expect.any(String),
              "improvement-id-text": expect.any(String),
              "improvement-item": expect.any(String),
              "improvement-summary-text": expect.any(String),
              "indicative-cost": expect.any(String),
              "lmk-key": expect.any(String),
            }),
          ])
        );
      });
  });

  it("GET /recommendation/:lmkkey should return 404 if not found", () => {
    return request(app).get("/recommendation/abc").expect(404);
  });
});
