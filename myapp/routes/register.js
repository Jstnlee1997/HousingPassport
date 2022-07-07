const { addUser } = require("./dynamo-users");

const router = require("express").Router();
const bcrypt = require("bcrypt");

router
  .route("/")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(async (req, res, next) => {
    try {
      console.log("I got here");
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log(hashedPassword);
      // Create user
      const user = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      };
      // Add user to database
      console.log(user);
      addUser(user);
      res.redirect("/login");
    } catch {
      res.redirect("/register");
    }
  });

module.exports = router;
