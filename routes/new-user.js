const router = require("express").Router();
const { checkAuthenticated } = require(".");
const { getCertificatesOfPostCode } = require("./epc");
const { getUserById } = require("./rds-users");

/* routing for new users to input postcode */
router.route("/").get(checkAuthenticated, (req, res) => {
  // Get the userId from the session passport
  const userId = req.session.passport.user;
  // check if user has EPC certificate allocated
  getUserById(userId).then(async (result) => {
    if (result.lmkKey != null) {
      // User has EPC -> redirect to index page
      return res.redirect("/");
    }
    res.render("new-user/new-user", {
      title: "New User",
    });
  });
});

// routing for new users to select their address from their queried postcode
router.route("/postcode").get(checkAuthenticated, async (req, res, next) => {
  // Get the userId from the session passport
  const userId = req.session.passport.user;
  // check if user has EPC certificate allocated
  getUserById(userId).then(async (result) => {
    if (result.lmkKey != null) {
      // User has EPC -> redirect to index page
      return res.redirect("/");
    }
  });

  try {
    // Get the postcode from the request and get all the relevant addresses
    const postcode = req.query.postcode;
    const response = await getCertificatesOfPostCode(postcode);
    if (Object.keys(response).length === 0) {
      console.log(response.length);
      // No addresses under given postcode
      console.log("Invalid postcode");
      return res.redirect("/");
    }
    var addresses = [];

    // Add all the addresses with the same postcode
    response.forEach((element) => {
      addresses.push(element["address"]);
    });
    // render the new form with all the addresses
    res.render("new-user/postcode", {
      title: postcode,
      addresses: addresses.sort(),
      postcode: postcode,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
