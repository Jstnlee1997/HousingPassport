const router = require("express").Router();
const { checkAuthenticated } = require(".");
const {
  updateAggregateDataOfLocalAuthority,
} = require("./dynamo-aggregate-data");
const {
  getCertificateByLmkKey,
  updateCertificate,
} = require("./dynamo-epc-certificates");
const { returnNewEnergyRating } = require("./dynamo-local-authorities");
const { getUserById } = require("./rds-users");

router
  .route("/")
  .get(checkAuthenticated, async (req, res, next) => {
    // Get the userId from the session passport
    const userId = req.session.passport.user;
    getUserById(userId).then(async (result) => {
      // User has no epc cert -> redirect to /new-user
      const lmkKey = result.lmkKey;
      console.log("Lmk-key of user: ", lmkKey);
      if (lmkKey == null) {
        // User has no EPC -> redirect to new user
        return res.redirect("/new-user");
      }

      /* Get certificate from database */
      const certificate = await getCertificateByLmkKey(lmkKey);
      res.render("edit-epc", {
        title: "Edit-epc",
        certificate: certificate,
      });
    });
  })
  .post(checkAuthenticated, async (req, res, next) => {
    console.log("New EPC data: ", req.body);
    // Get the lmk-key and local-authoritiy of the user
    const lmkKey = req.body["lmk-key"];

    // Get certificate from database
    const certificate = await getCertificateByLmkKey(lmkKey);

    /* Replace each <item> in the certificate with req.body[<item>] */
    Object.entries(req.body).forEach((item) => {
      certificate[item[0]] = item[1];
    });

    /* Update the energy-ratings depending on the energy-efficiencies */
    certificate["current-energy-rating"] = await returnNewEnergyRating(
      certificate["current-energy-efficiency"]
    );
    certificate["potential-energy-rating"] = await returnNewEnergyRating(
      certificate["potential-energy-efficiency"]
    );
    console.log("Newly edited epc-certificate: ", certificate);

    /* Update aggregate data before updating epc-certificate */
    const localAuthority = certificate["local-authority"];
    updateAggregateDataOfLocalAuthority(certificate).then(async (res) => {
      /* Update epc-certificate table */
      await updateCertificate(certificate);
    });

    res.redirect("/");
  });

module.exports = router;
