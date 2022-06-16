const router = require("express").Router();
const got = require("got");
const { pipeline } = require("stream");
const { getCertificateByLmkKey } = require("./dynamo");

const url =
    "https://epc.opendatacommunities.org/api/v1/domestic/certificate/1573380469022017090821481343938953",
  Authorization =
    "Basic anpsMThAaWMuYWMudWs6MTA3YzQ1YWJiMjhkZWIyYmM0MDM0MjFkMmY3YTI4OTViMmUwYjA0Ng==",
  Accept = "application/json";

router.get("/", function (req, res) {
  const dataStream = got.stream({
    url: url,
    headers: {
      Authorization: auth,
      Accept: accept,
    },
  });
  pipeline(dataStream, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
});

module.exports = router;
