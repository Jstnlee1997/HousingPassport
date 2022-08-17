const request = require("supertest");
const app = require("../app");
const server = request.agent("http://localhost:3000");
require("dotenv").config();

describe("Register User", () => {
  it("GET /register should get form for name, email and password", () => {
    return request(app)
      .get("/register")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then((res) => {
        expect(res.text.includes('input type="name"'));
        expect(res.text.includes('input type="email"'));
        expect(res.text.includes('input type="password"'));
      });
  });

  it("POST /register with existing email should redirect back to register page", (done) => {
    server
      .post("/register")
      .send({
        email: process.env.USER_LOGIN_EMAIL,
        password: "abcde",
      })
      .expect(302)
      .expect("Location", "/register")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /register"));
        return done();
      });
  });

  it("login", loginUser());

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

  it("GET /register with logged in user should return 302 and redirect to index page", (done) => {
    server
      .get("/register")
      .expect(302)
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /"));
        done();
      });
  });
});
