var request = require("supertest");
var server = request.agent("http://localhost:3000");
require("dotenv").config();

describe("GET /edit-epc", () => {
  it("GET /edit-epc with NOT authenticated should return 302 and redirect to /login", (done) => {
    server
      .get("/edit-epc")
      .expect(302)
      .expect("Location", "/login")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /login"));
        console.log(res.text);
        done();
      });
  });

  it("login", loginUser());
  it("GET /edit-epc should return 200 and form for user to edit and POST", (done) => {
    server
      .get("/edit-epc")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text.includes('action="/edit-epc" method="POST"'));
        expect(
          res.text.includes(
            'input type="text" name="current-energy-efficiency"'
          )
        );
        expect(
          res.text.includes(
            'input type="text" name="potential-energy-efficiency"'
          )
        );
        done();
      });
  });
});

describe("POST /edit-epc", () => {});

function loginUser() {
  return function (done) {
    server
      .post("/login")
      .send({
        email: process.env.USER_LOGIN_EMAIL,
        password: process.env.USER_LOGIN_PASSWORD,
      })
      .expect(302)
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  };
}
