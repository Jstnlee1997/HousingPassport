const router = require("express").Router();
const { getLmkKeyOfAddress, addCertificateByLmkKey } = require("./epc");
const { getCertificateByLmkKey } = require("./dynamo-certs");
const { getUserById, updateAddressAndLmkKeyUsingId } = require("./rds-users");

/* GET home page. */
router
  .route("/")
  .get(checkAuthenticated, hasEpcCertificate, (req, res, next) => {
    // Renders index page only if user has EPC Cert
    res.render("index", { title: "Housing Passport" });
  })
  // user has identified their address
  .post(async (req, res, next) => {
    // obtain selected address
    const address = req.body.address;

    /* TODO: save in table userId and their address */
    // Get the userId from the session passport
    const userId = req.session.passport.user;
    console.log("Current User ID: ", userId);

    // Get lmk-key using user's address
    const lmkKey = await getLmkKeyOfAddress(address);

    // Store address and lmk-key into user database
    updateAddressAndLmkKeyUsingId(address, lmkKey, userId);
    console.log(`New address is: ${address}, and lmk-key is: ${lmkKey}`);

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

/* LOGOUT */
router.route("/logout").delete((req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
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

function hasEpcCertificate(req, res, next) {
  // Get the userId from the session passport
  const userId = req.session.passport.user;
  // check if user has EPC certificate allocated
  getUserById(userId).then(async (result) => {
    if (result.lmkKey == null) {
      // User has no EPC -> redirect to new user
      return res.redirect("/new-user");
    }
    next();
  });
}

module.exports = {
  router,
  checkAuthenticated,
  checkNotAuthenticated,
  hasEpcCertificate,
};
