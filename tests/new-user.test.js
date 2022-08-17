var request = require("supertest");
var server = request.agent("http://localhost:3000");
require("dotenv").config();

describe("GET /new-user", () => {
  it("GET /new-user with NOT authenticated should return 302 and redirect to /login", (done) => {
    server
      .get("/new-user")
      .expect(302)
      .expect("Location", "/login")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /login"));
        console.log(res.text);
        done();
      });
  });

  it(
    "Login with registered user that does not have address",
    loginUserWithoutAddress()
  );

  it("GET / with registered user should return 302 and redirect to new-user if user does not have address", (done) => {
    server
      .get("/")
      .expect(302)
      .expect("Location", "/new-user")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /new-user"));
        done();
      });
  });

  it("GET /new-user should return 200 and form for user input postcode", (done) => {
    server
      .get("/new-user")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .end(function (err, res) {
        if (err) return done(err);
        expect(
          res.text.includes('form action="/new-user/postcode" method="GET"')
        );
        expect(res.text.includes('input type="text" name="postcode"'));
        expect(
          res.text.includes('form action="/logout?_method=DELETE" method="POST')
        );
        done();
      });
  });
});

describe("GET /new-user/postcode", () => {
  it("GET /new-user/postcode with valid postcode should return 200 display addresses", (done) => {
    server
      .get("/new-user/postcode?postcode=s12")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text.includes("postal code: s12"));
        expect(res.text.includes('form action="/" method="POST"'));
        expect(res.text.includes('input type="radio" name="address"'));
        expect(res.text.includes('input type="submit"'));
        done();
      });
  });

  it("GET /new-user/postcode with invalid postcode should redirect to /new-user", (done) => {
    server
      .get("/new-user/postcode?postcode=s12")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.text.includes("Redirect to /new-user"));
        done();
      });
  });

  it("logout user without address", logoutUserWithoutAddress());
  it("login user WITH address", loginValidUserWithAddress());

  it("GET /new-user with user that has address should redirect back to index page", (done) => {
    server
      .get("/new-user")
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /"));
        done();
      });
  });

  it("GET /new-user/postcode with user that has address should redirect back to index page", (done) => {
    server
      .get("/new-user/postcode?postcode=s12")
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text.includes("Redirecting to /"));
        done();
      });
  });
});

function loginUserWithoutAddress() {
  return function (done) {
    server
      .post("/login")
      .send({
        email: process.env.USER_LOGIN_WITHOUT_ADDRESS_EMAIL,
        password: process.env.USER_LOGIN_WITHOUT_ADDRESS_PASSWORD,
      })
      .expect(302)
      .expect("Location", "/")
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  };
}

function logoutUserWithoutAddress() {
  return function (done) {
    server
      .del("/logout")
      .expect(302)
      .expect("Location", "/login")
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  };
}

function loginValidUserWithAddress() {
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
