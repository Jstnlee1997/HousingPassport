const request = require("supertest");
const app = require("../app");

const validLmkKey = "1573380469022017090821481343938953";

describe("EPC Certificates", () => {
  it("GET /epc/:lmkkey should return certificate if valid", () => {
    return request(app)
      .get(`/epc/${validLmkKey}`)
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            "lmk-key": validLmkKey,
          })
        );
      });
  });

  it("GET /epc/:lmkkey should return 404 if not found", () => {
    return request(app).get("/epc/abc").expect(404);
  });

  it("GET /epc/postcode/:postcode should return certificates", () => {
    return request(app)
      .get("/epc/postcode/sw67sr")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body[0]).toHaveProperty("lmk-key");
      });
  });

  it("GET /epc/postcode/:postcode should return 404 if not found", () => {
    return request(app).get("/epc/postcode/123").expect(404);
  });
});
