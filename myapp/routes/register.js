const router = require("express").Router();
const bcrypt = require("bcrypt");
const { addNewUser } = require("./rds-users");

router
  .route("/")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // Add user to database
      addNewUser(req.body.name, req.body.email, hashedPassword);
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
  });

module.exports = router;
