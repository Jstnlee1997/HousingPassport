const router = require("express").Router();
const axios = require("axios");
const { addRecommendation } = require("./dynamo-recos");
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
      console.log(res.status);
      if (res.data) {
        return res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to get recommendation and store into dynamo DB given lmkkey
const seedRecommendation = async (lmkKey) => {
  // get recommendation from EPC API
  const recommendations = await getRecommendationsByLmkKey(lmkKey);

  // store recommendation into dynamoDB
  try {
    // console.log(recommendations);
    // addRecommendation(recommendation);
    const recommendationPromises = recommendations["rows"].map(
      (recommendation) => {
        addRecommendation(recommendation);
      }
    );
    await Promise.all(recommendationPromises);
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
// getRecommendationsByLmkKey("1573380469022017090821481343938953");

// Test seedRecommendation to add all recommendations for a given lmk-key
// seedRecommendation("1573380469022017090821481343938953");

module.exports = router;
