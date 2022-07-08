const passport = require("passport");

const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.render("login");
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

module.exports = router;
