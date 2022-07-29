const AWS = require("aws-sdk");
const { getLngLatCoordinates } = require("./open-cage");
require("dotenv").config();

// connection to AWS
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create client to conenct to document store for DynamoDB
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "epc-certificates";

const getCertificates = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const certificates = await dynamoClient.scan(params).promise();
  // console.log(certificates);
  return certificates;
};

const getCertificateByLmkKey = async (lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
    },
  };
  return await (
    await dynamoClient.get(params).promise()
  ).Item;
};

// Testing finding of certificate by lmk-key
// const found = getCertificateByLmkKey(
//   "e2a198e1920ce4e5da1471d61e79656b564278202f30c8c1d96a28a00770eb2e"
// ).then((result) => {
//   console.log(result);
// });

const addCertificate = async (certificate) => {
  // Add latlng coordinates to the certificate
  const { lat, lng } = await getLngLatCoordinates(
    certificate["address"],
    certificate["postcode"]
  );
  certificate["lat"] = lat;
  certificate["lng"] = lng;

  const params = {
    TableName: TABLE_NAME,
    Item: certificate,
  };
  // use client to call a put method
  return await dynamoClient.put(params).promise();
};

// Testing function addCertificate
const fakeNewCertificate = {
  Item: {
    "extension-count": "0",
    "constituency-label": "Hammersmith",
    "lighting-env-eff": "Very Good",
    "floor-description": "(other premises below)",
    "lmk-key": "1234",
    "potential-energy-efficiency": "20",
    "transaction-type": "rental (private)",
    "property-type": "Maisonette",
    "lighting-cost-current": "50",
    "number-habitable-rooms": "6",
    "walls-description": "Solid brick, as built, no insulation (assumed)",
    "photo-supply": "",
    "lighting-cost-potential": "50",
    "roof-description": "Flat, no insulation",
    "roof-env-eff": "Very Poor",
    "built-form": "Mid-Terrace",
    "secondheat-description": "None",
    "mainheatcont-description": "Programmer, room thermostat and TRVs",
    address1: "94 Lillie Road",
    address2: "",
    "unheated-corridor-length": "",
    county: "Greater London Authority",
    "co2-emissions-current": "3.0",
    "mainheat-energy-eff": "Good",
    address: "94 Lillie Road",
    "glazed-area": "Normal",
    "total-floor-area": "133",
    "multi-glaze-proportion": "100",
    "walls-energy-eff": "Poor",
    "lodgement-datetime": "2017-09-08 21:48:13",
    "mainheatc-energy-eff": "Good",
    "windows-energy-eff": "Average",
    "solar-water-heating-flag": "N",
    "heating-cost-current": "800",
    "sheating-energy-eff": "N/A",
    "windows-description": "Fully double glazed",
    "hot-water-cost-potential": "70",
    "lighting-description": "Low energy lighting in 83% of fixed outlets",
    "walls-env-eff": "Poor",
    "number-open-fireplaces": "0",
    posttown: "LONDON",
    "current-energy-rating": "D",
    "environment-impact-potential": "50",
    "floor-height": "",
    "local-authority-label": "Hammersmith and Fulham",
    "current-energy-efficiency": "0",
    "flat-top-storey": "Y",
    "sheating-env-eff": "N/A",
    "number-heated-rooms": "6",
    "energy-consumption-current": "180",
    "fixed-lighting-outlets-count": "",
    "floor-env-eff": "N/A",
    "potential-energy-rating": "C",
    "co2-emiss-curr-per-floor-area": "20",
    "mainheatc-env-eff": "Good",
    "hot-water-env-eff": "Good",
    "mainheat-description": "Boiler and radiators, mains gas",
    "hotwater-description": "From main system",
    "energy-consumption-potential": "80",
    uprn: "34053831",
    "lodgement-date": "2017-09-08",
    "mechanical-ventilation": "natural",
    "construction-age-band": "England and Wales: 1900-1929",
    address3: "",
    "local-authority": "E09000013",
    "floor-energy-eff": "NO DATA!",
    "windows-env-eff": "Average",
    "flat-storey-count": "",
    postcode: "SW6 7SR",
    "inspection-date": "2017-09-07",
    "main-fuel": "mains gas (not community)",
    "roof-energy-eff": "Very Poor",
    "mains-gas-flag": "Y",
    "co2-emissions-potential": "3",
    "main-heating-controls": "2106",
    "energy-tariff": "Single",
    "uprn-source": "Address Matched",
    "building-reference-number": "5465683578",
    "wind-turbine-count": "0",
    "hot-water-cost-current": "120",
    "floor-level": "1st",
    "heat-loss-corridor": "no corridor",
    "glazed-type": "double glazing, unknown install date",
    "lighting-energy-eff": "Very Good",
    constituency: "E14000726",
    "low-energy-fixed-light-count": "",
    "heating-cost-potential": "300",
    tenure: "rental (private)",
    "hot-water-energy-eff": "Good",
    "environment-impact-current": "30",
    "low-energy-lighting": "40",
    "mainheat-env-eff": "Good",
  },
};
// addCertificate(fakeNewCertificate.Item);

const deleteCertificateByLmkKey = async (lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
    },
  };
  // use client ot call a delete method
  return await dynamoClient.delete(params).promise();
};

// Test deleteCertificateByLmkKey
// const found = deleteCertificateByLmkKey(
//   "27ddea68c8dddfd24bb13c298dbb22243ddef422427969946d0997915093e297"
// ).then(async (res) => {
//   console.log(res);
// });

async function addLongLatCoordinates(event, context) {
  let tableContents;
  try {
    // get items from dynamo
    const params = { TableName: TABLE_NAME };
    tableContents = await scanDB(params);
  } catch (err) {
    console.log(err);
    return err;
  }
  let calls = [];
  tableContents.forEach(function (value) {
    const address = value["address"];
    const postcode = value["postcode"];
    getLngLatCoordinates(address, postcode).then(async (res) => {
      const { lat, lng } = res;
      console.log(
        "Address: " + address + " , postcode: " + postcode + " => lat: ",
        lat + " , lng: " + lng
      );
      let params = {
        TableName: TABLE_NAME,
        Key: {
          "lmk-key": value["lmk-key"],
        },
        UpdateExpression: "SET lat = :lat, lng = :lng",
        ExpressionAttributeValues: {
          ":lat": lat,
          ":lng": lng,
        },
      };
      calls.push(dynamoClient.update(params).promise());
    });
  });
  let response;
  try {
    response = await Promise.all(calls);
  } catch (err) {
    console.log(err);
  }
  return response;
}

async function scanDB(params) {
  let dynamoContents = [];
  let items;
  do {
    items = await dynamoClient.scan(params).promise();
    items.Items.forEach((item) => dynamoContents.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");
  return dynamoContents;
}

// addLongLatCoordinates();

module.exports = {
  dynamoClient,
  getCertificates,
  getCertificateByLmkKey,
  addCertificate,
  deleteCertificateByLmkKey,
};
