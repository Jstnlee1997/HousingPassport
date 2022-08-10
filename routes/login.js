const passport = require("passport");
const { checkNotAuthenticated } = require(".");

const router = require("express").Router();

router
  .route("/")
  .get(checkNotAuthenticated, (req, res, next) => {
    res.render("login", {
      title: "Login",
    });
  })
  .post(
    checkNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

module.exports = router;
