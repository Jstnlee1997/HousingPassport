const router = require("express").Router();
const { getLmkKeyOfAddress, addCertificateByLmkKey } = require("./epc");
const { getCertificateByLmkKey } = require("./dynamo-epc-certificates");
const { getUserById, updateAddressAndLmkKeyUsingId } = require("./rds-users");
const { getRecommendationsByLmkKey } = require("./dynamo-epc-recommendations");
const { addRecommendationsByLmkKey } = require("./recommendation");
const {
  updateAggregateDataOfLocalAuthority,
} = require("./dynamo-aggregate-data");
const { getSmartMeterInformationByLmkKey } = require("./dynamo-smart-meter");
const {
  getCompletedRecommendationsByLmkKey,
} = require("./dynamo-epc-completed-recommendations");

/* GET home page. */
router
  .route("/")
  .get(checkAuthenticated, async (req, res, next) => {
    // Get the userId from the session passport
    const userId = req.session.passport.user;
    console.log(userId);

    // Get the lmk-key of the user
    getUserById(userId).then(async (result) => {
      // User has no epc cert -> redirect to /new-user
      const lmkKey = result.lmkKey;
      console.log("Lmk-key of user: ", lmkKey);
      if (lmkKey == null) {
        // User has no EPC -> redirect to new user
        return res.redirect("/new-user");
      }

      /* Check if certificate exists in database, add in if it is not, else just retrieve it */
      const certificate = await getCertificateByLmkKey(lmkKey);
      if (typeof certificate !== "undefined") {
        // Certificate is in DB
        console.log("Certificate of this address is present in database");

        // Get the smart meter data if applicable
        const smartMeterInformation = await (
          await getSmartMeterInformationByLmkKey(lmkKey)
        ).Items;
        console.log(
          "Smart meter information for this property: ",
          smartMeterInformation
        );

        // Get the recommendations for this property
        const recommendations = await (
          await getRecommendationsByLmkKey(lmkKey)
        ).Items;
        console.log("Recommendations for this property: ", recommendations);

        // Get the completed recommendations for this property
        const completedRecommendations = await (
          await getCompletedRecommendationsByLmkKey(lmkKey)
        ).Items;
        console.log(
          "Completed recommendations for this property: ",
          completedRecommendations
        );

        res.render("index", {
          title: "Housing Passport",
          certificate: certificate,
          smartMeterInformation: smartMeterInformation,
          recommendations: recommendations,
          completedRecommendations: completedRecommendations,
        });
      } else {
        // add certificate into database, AND add recomendations as well
        console.log("Certificate of this address is not present in database");

        // Add certificate by lmk-key first
        const certificate = await addCertificateByLmkKey(lmkKey);
        // Add recommendations next
        await addRecommendationsByLmkKey(lmkKey);

        /* No need to check for smart meter information since it can't be added in at this point */

        // Add certificate to local-authority table
        updateAggregateDataOfLocalAuthority(
          await getCertificateByLmkKey(lmkKey)
        );

        res.render("index", {
          title: "Housing Passport",
          certificate: certificate,
          smartMeterInformation: [], // No smartmeter information at this point
          recommendations: await (
            await getRecommendationsByLmkKey(lmkKey)
          ).Items,
          completedRecommendations: await (
            await getCompletedRecommendationsByLmkKey(lmkKey)
          ).Items,
        });
      }
    });
  })
  // user has identified their address
  .post(checkAuthenticated, async (req, res, next) => {
    // obtain selected address
    const address = req.body.address;

    // Get the userId from the session passport
    const userId = req.session.passport.user;
    console.log("Current User ID: ", userId);

    // Get lmk-key using user's address
    const lmkKey = await getLmkKeyOfAddress(address);

    // Store address and lmk-key into user database
    try {
      await updateAddressAndLmkKeyUsingId(address, lmkKey, userId);
      console.log(`New address is: ${address}, and lmk-key is: ${lmkKey}`);
      res.status(201).redirect("/");
    } catch (err) {
      // No 2 users can have the same lmk-key
      console.log(err);

      // Redirect to index page
      res.redirect("/new-user");
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
    res.redirect("/new-user");
  });
}

module.exports = {
  router,
  checkAuthenticated,
  checkNotAuthenticated,
  hasEpcCertificate,
};
