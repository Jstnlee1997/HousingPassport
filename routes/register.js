const router = require("express").Router();
const bcrypt = require("bcrypt");
const { checkNotAuthenticated } = require(".");
const { addNewUser } = require("./rds-users");

router
  .route("/")
  .get(checkNotAuthenticated, (req, res, next) => {
    res.render("register", {
      title: "Register",
    });
  })
  .post(checkNotAuthenticated, async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // Add user to database
      await addNewUser(req.body.name, req.body.email, hashedPassword);
      res.status(201).redirect("/login");
    } catch (err) {
      console.error(err);
      return res.redirect("/register");
    }
  });

module.exports = router;
