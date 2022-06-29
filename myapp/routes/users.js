var express = require("express");
const { route } = require("./recommendation");
var router = express.Router();

/* GET users listing. */
router.route("/").get((req, res, next) => {
  res.send("respond with a resource");
});

router.route("/new").get((req, res, next) => {
  res.render("users/new");
});

module.exports = router;
