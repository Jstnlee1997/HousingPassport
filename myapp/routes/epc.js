const router = require("express").Router();
// const got = require("got");
// const { pipeline } = require("stream");
const axios = require("axios");
const { addCertificate } = require("./dynamo");

// Variables to authenticate energy epc account
const Authorization = process.env.EPC_AUTHORIZATION;
const Accept = "application/json";

// Function to seed data from EPC API into dynamo DB
const seedData = async () => {
  const url =
    "https://epc.opendatacommunities.org/api/v1/domestic/search?size=1&from=";

  // create for loop that runs through from 0 to 30 million, in multiples of 5000
  for (let i = 2879; i < 3000; i += 1) {
    // Vary url for different pages
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

// Function to get all the certificates of queried postcode
const getCertificatesOfPostCode = async (postcode) => {
  return axios
    .get(
      "https://epc.opendatacommunities.org/api/v1/domestic/search?size=100&postcode=" +
        postcode,
      {
        headers: {
          Authorization: Authorization,
          Accept: Accept,
        },
      }
    )
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

/* GET certificates for postcode query */
router.get("/postcode/:postcode", function (req, res, next) {
  console.log(req.params);

  // check if there are returned certificates
  const found = getCertificatesOfPostCode(req.params.postcode);
  found.then((result) => {
    console.log(result);
    if (result) {
      res.send(JSON.stringify(result["rows"]));
    } else {
      res.send("No certificates under indicated postcode");
    }
  });
});

// seedData();

// var cert = getCertificatesOfPostCode("sw67sr");
// cert.then((result) => {
//   console.log(result);
// });

module.exports = router;
