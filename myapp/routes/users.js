const router = require("express").Router();
const { getCertificatesOfPostCode } = require("./epc");

/* GET users listing. */
router.route("/").get((req, res) => {
  res.send("respond with a resource");
});

// routing for new users to input postcode
router.route("/new").get((req, res) => {
  res.render("users/new");
});

// routing for new users to select their address from their queried postcode
router.route("/new/postcode").get(async (req, res, next) => {
  try {
    // Get the postcode from the request and get all the relevant addresses
    const postcode = req.query.postcode;
    const response = await getCertificatesOfPostCode(postcode);
    var addresses = [];

    // Add all the addresses with the same postcode
    response.forEach((element) => {
      addresses.push(element["address"]);
    });
    // render the new form with all the addresses
    res.render("users/new/postcode", {
      addresses: addresses.sort(),
      postcode: postcode,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
