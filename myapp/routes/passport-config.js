const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserByEmail, getUserById } = require("./rds-users");

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    // call done whenever done authenticating user
    getUserByEmail(email)
      .then(async (result) => {
        if (result == null) {
          // Found no user
          return done(null, false, { message: "No user with that email" });
        }
        if (await bcrypt.compare(password, result.password)) {
          // password matches
          return done(null, result);
        } else {
          return done(null, false, { message: "Password Incorrect" });
        }
      })
      .catch((err) => {
        return done(err);
      });
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
