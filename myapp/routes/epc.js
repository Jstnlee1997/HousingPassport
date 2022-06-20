const router = require("express").Router();
// const got = require("got");
// const { pipeline } = require("stream");
const axios = require("axios");
const { addCertificate } = require("./dynamo");

// Variables to authenticate energy epc account
const Authorization = process.env.EPC_AUTHORIZATION;
const Accept = "application/json";
const url =
  "https://epc.opendatacommunities.org/api/v1/domestic/search?size=1&from=";

// Function to seed data from EPC API into dynamo DB
const seedData = async () => {
  // create for loop that runs through from 0 to 30 million, in multiples of 5000
  for (let i = 2879; i < 3000; i += 1) {
    // Vary url for different pages
    console.log(url + i);
    console.log(Authorization);
    try {
      const { data: certificates } = await axios.get(url + i, {
        headers: {
          Authorization: Authorization,
          Accept: Accept,
        },
      });

      const certificatePromises = certificates["rows"].map((certificate) =>
        addCertificate(certificate)
      );
      await Promise.all(certificatePromises);
    } catch (err) {
      console.log(err);
    }
  }
};

seedData();

module.exports = router;
