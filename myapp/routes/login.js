const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.render("login");
  })
  .post((req, res, next) => {});

module.exports = router;
