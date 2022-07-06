const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.render("register");
  })
  .post((req, res, next) => {});

module.exports = router;
