const request = require("supertest");
const app = require("../app");

describe("User Signup", () => {
  /* TODO: Test user signup using password and username */
  // it("POST /users/ should store user in user database");

  // it("POST /users/ should redirect to /users/new");

  it("GET users/new should allow user to input postcode", () => {
    return request(app)
      .get("users/new")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  // it ("GET users/new should return list of addresses and redirect to users/new/postcode")

  // it ("POST users/new/postcode should store user's address in database and redirect to users/")

  // it("GET /epc/:lmkkey should return certificate if valid", () => {
  //   return request(app)
  //     .get(
  //       "/epc/1e087cfceb2b4e4cf113af8991c2775332cf8dfdb9ceec8bbc18540c9eb2011f"
  //     )
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .then((res) => {
  //       expect(res.body).toHaveProperty("lmk-key");
  //     });
  // });
});
