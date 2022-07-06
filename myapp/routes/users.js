const router = require("express").Router();
const {
  getCertificatesOfPostCode,
  getLmkKeyOfAddress,
  addCertificateByLmkKey,
} = require("./epc");
const { getCertificateByLmkKey } = require("./dynamo-certs");

/* GET users listing. */
router
  .route("/")
  .get((req, res) => {
    res.send("respond with a resource");
  })
  // user has identified their address
  .post(async (req, res, next) => {
    // obtain selected address
    const address = req.body.address;

    /* TODO: save in table userId and their address */

    // TODO: Get lmk-key using user's address and store into user database

    // Return lmk-key of address
    const lmkKey = await getLmkKeyOfAddress(address);

    /* TODO: Check if certificate exists in database, add in if it is not, else just retrieve it */
    const found = await getCertificateByLmkKey(lmkKey);
    if (found.Item) {
      console.log("Certificate of this address is present in database");
      res.json(found.Item);
    } else {
      console.log("Certificate of this address not present in database");
      res.json(await addCertificateByLmkKey(lmkKey));
    }
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
