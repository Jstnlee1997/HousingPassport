const router = require("express").Router();
// const got = require("got");
// const { pipeline } = require("stream");
const axios = require("axios");
const { addCertificate, getCertificateByLmkKey } = require("./dynamo-certs");

// Variables to authenticate energy epc account
const Authorization = process.env.EPC_AUTHORIZATION;
const Accept = "application/json";

// Function to seed data from EPC API into dynamo DB
const seedData = async () => {
  const url =
    "https://epc.opendatacommunities.org/api/v1/domestic/search?size=1000&from=";

  // create for loop that runs through from 0 to 30 million, in multiples of 5000
  for (let i = 0; i < 1000; i += 1000) {
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

// Function to add a certificate to database using a specific lmk-key
const addCertificateByLmkKey = async (lmkKey) => {
  return axios
    .get(
      "https://epc.opendatacommunities.org/api/v1/domestic/certificate/" +
        lmkKey,
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
        // add certificate to database
        addCertificate(res.data["rows"][0]);
        return res.data["rows"][0];
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
        return res.data["rows"];
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to get lmk-key of queried address
const getLmkKeyOfAddress = async (address) => {
  return axios
    .get(
      "https://epc.opendatacommunities.org/api/v1/domestic/search?address=" +
        address,
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
        return res.data["rows"][0]["lmk-key"];
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/* GET certificate of lmk-key */
router.route("/:lmkKey").get((req, res, next) => {
  // console.log(req.params);

  // check if there is an lmk-key in the database
  const found = getCertificateByLmkKey(req.params.lmkKey);
  found.then((result) => {
    // Display the epc certificate if valid
    if (result.Item) {
      res.send(result["Item"]);
    } else {
      res.status(404).send("There is no certificate by the given lmk-key");
    }
  });
});

/* GET certificates for postcode query */
router.route("/postcode/:postcode").get((req, res, next) => {
  // console.log(req.params);

  // check if there are returned certificates
  const found = getCertificatesOfPostCode(req.params.postcode);
  found.then((result) => {
    console.log(result);
    if (result) {
      res.send(result["rows"]);
    } else {
      res.status(404).send("No certificates under indicated postcode");
    }
  });
});

/* Testing seedData */
// seedData();

/* Testing getCertificatesOfPostcode */
// getCertificatesOfPostCode("SW6 7SR");

/* Testing addCertificateByLmkKey */
// addCertificateByLmkKey("1573380469022017090821481343938953");

module.exports = {
  router: router,
  getCertificatesOfPostCode: getCertificatesOfPostCode,
  getLmkKeyOfAddress: getLmkKeyOfAddress,
  addCertificateByLmkKey: addCertificateByLmkKey,
};
