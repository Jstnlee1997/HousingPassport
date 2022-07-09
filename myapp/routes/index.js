const router = require("express").Router();
const { getLmkKeyOfAddress, addCertificateByLmkKey } = require("./epc");
const { getCertificateByLmkKey } = require("./dynamo-certs");

/* GET home page. */
router
  .route("/")
  .get(checkAuthenticated, (req, res, next) => {
    res.render("index", { title: "Express" });
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = { router, checkAuthenticated, checkNotAuthenticated };
