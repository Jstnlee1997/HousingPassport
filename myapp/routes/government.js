const router = require("express").Router();

router.route("/").get((req, res, next) => {
  res.render("register");
});

module.exports = router;
