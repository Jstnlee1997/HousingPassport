const router = require("express").Router();
const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

// Variables to authenticate energy epc account
const Authorization = process.env.EPC_AUTHORIZATION;
const Accept = "application/json";
const url =
  "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/";

const getRecommendationByLmkKey = async (lmkKey) => {
  axios
    .get(url + lmkKey, {
      headers: {
        Authorization: Authorization,
        Accept: Accept,
      },
    })
    .then((res) => {
      console.log(res.status);
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

getRecommendationByLmkKey("1573380469022017090821481343938953");

module.exports = router;
