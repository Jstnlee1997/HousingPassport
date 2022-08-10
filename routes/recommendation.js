const router = require("express").Router();
const axios = require("axios");
const { addRecommendation } = require("./dynamo-epc-recommendations");
require("dotenv").config();

// Variables to authenticate energy epc account
const Authorization = process.env.EPC_AUTHORIZATION;
const Accept = "application/json";
const url =
  "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/";

// Function to get recommendations by lmk-key from epc API
const getRecommendationsByLmkKey = async (lmkKey) => {
  return axios
    .get(url + lmkKey, {
      headers: {
        Authorization: Authorization,
        Accept: Accept,
      },
    })
    .then((res) => {
      if (res.data) {
        console.log();
        return res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to get recommendation and store into dynamo DB given lmkkey
const addRecommendationsByLmkKey = async (lmkKey) => {
  // get recommendation from EPC API
  const recommendations = await getRecommendationsByLmkKey(lmkKey);

  // store recommendation into dynamoDB
  try {
    if (typeof recommendations !== "undefined") {
      const recommendationPromises = recommendations["rows"].map(
        (recommendation) => {
          addRecommendation(recommendation);
        }
      );
      await Promise.all(recommendationPromises);
    }
  } catch (err) {
    console.log(err);
  }
};

/* GET all recommendations given an lmk-key */
router.route("/:lmkKey").get((req, res, next) => {
  // console.log(req.params);

  // check if there is an lmk-key in the database
  const found = getRecommendationsByLmkKey(req.params.lmkKey);
  found.then((result) => {
    // Display all the recommendations if valid
    if (result) {
      res.send(result.rows);
    } else {
      res.status(404).send("There are no recommendations by the given lmk-key");
    }
  });
});

// Test getting recommendation using input lmk-key
// getRecommendationsByLmkKey(
//   "6529dbb2d788d187895a35c6db0e7263b53eddebc7cc0e0df3576e05ee761e8d"
// );

// Test addRecommendationsByLmkKey to add all recommendations for a given lmk-key
// addRecommendationsByLmkKey("1573380469022017090821481343938953");

module.exports = {
  router,
  addRecommendationsByLmkKey,
};
