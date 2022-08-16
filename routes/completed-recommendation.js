const { checkAuthenticated } = require(".");
const {
  updateLastUpdatedOfCertificateByLmkKey,
} = require("./dynamo-epc-certificates");
const {
  addCompletedRecommendation,
} = require("./dynamo-epc-completed-recommendations");
const {
  getRecommendationByLmkKeyAndImprovementId,
  deleteRecommendationByLmkKeyAndImprovementId,
} = require("./dynamo-epc-recommendations");
const {
  updateRecommendationsInfoOfProperty,
} = require("./dynamo-local-authorities");

const router = require("express").Router();
require("dotenv").config();

router.route("/").post(checkAuthenticated, async (req, res, next) => {
  // Get the lmk-key and improvement-id(s) from the params and body
  const lmkKey = req.body.lmkKey;
  const localAuthority = req.body.localAuthority;
  const improvementId = req.body.completedRecommendation;
  console.log("Completed Recommendation has improvement-id: ", improvementId);

  // Return if there is no recommendation selected
  if (typeof improvementId === "undefined") {
    return res.redirect("/");
  }

  // Get the recommendation from epc-recommendations table
  const recommendation = await getRecommendationByLmkKeyAndImprovementId(
    lmkKey,
    improvementId
  );
  console.log(recommendation);

  // Add it into epc-completed-recommendations table
  await addCompletedRecommendation(recommendation.Item);

  // Delete it from epc-recommendations table
  await deleteRecommendationByLmkKeyAndImprovementId(lmkKey, improvementId);

  // Update propertyInfo of property
  await updateRecommendationsInfoOfProperty(localAuthority, lmkKey);

  // updatedAt should be Date.now()
  await updateLastUpdatedOfCertificateByLmkKey(lmkKey);

  console.log("Succesfully completed a recommendation");

  res.redirect("/");
});

module.exports = router;
