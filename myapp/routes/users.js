const router = require("express").Router();

/* GET users listing. */
router.route("/").get((req, res) => {
  res.send("respond with a resource");
});

module.exports = router;
