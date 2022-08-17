const request = require("supertest");
const app = require("../app");
const server = request.agent("http://localhost:3000");
require("dotenv").config();

describe("Login User", () => {
  it("GET /login should get form for email and password", () => {
    return request(app)
      .get("/login")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then((res) => {
        expect(res.text.includes('input type="email"'));
        expect(res.text.includes('input type="password"'));
      });
  });

  it("POST /login with invalid credentials should redirect back to login page", (done) => {
    server
      .post("/login")
      .send({
        email: "abcde@abcde",
        password: "abcde",
      })
      .expect(302)
      .expect("Location", "/login")
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it(
    "POST /login with valid credentials should return 302 and redirect to index page",
    loginUser()
  );

  it("GET /index with registered user should return 200 with valid EPC data and logout button", (done) => {
    server
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Housing Passport"));
        expect(res.text.includes("EPC Data"));
        expect(
          res.text.includes(
            'form action="/logout?_method=DELETE" method="POST"'
          )
        );
        done();
      });
  });
});

describe("Logout User", () => {
  it("DEL /logout should log user out and redirect to login page", (done) => {
    server
      .del("/logout")
      .expect(302)
      .expect("Content-Type", "text/plain; charset=utf-8")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirect to /login"));
        done();
      });
  });
});

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
