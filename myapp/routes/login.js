const router = require("express").Router();

router.route("/").get((req, res, next) => {
  res.render("login");
});

module.exports = router;
