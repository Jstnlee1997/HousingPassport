const AWS = require("aws-sdk");
const { getCertificateByLmkKey } = require("./dynamo-certs");
const {
  addNewLocalAuthority,
  getLocalAuthorityInformation,
  addLmkKeyAndPropertyInfoToExistingLocalAuthority,
  returnNewEnergyRating,
  addFrequencyOfEnergyRating,
  updateFrequencyOfEnergyRating,
} = require("./dynamo-local-authorities");
const router = require("express").Router();
require("dotenv").config();

// connection to AWS
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create client to conenct to document store for DynamoDB
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "aggregate-data";

// Creating test variables
const testCertificate = {
  Item: {
    "extension-count": "0",
    "constituency-label": "Hammersmith",
    "lighting-env-eff": "Very Good",
    "floor-description": "(other premises below)",
    "lmk-key": "1573380469022017090821481343938953",
    "potential-energy-efficiency": "76",
    "transaction-type": "rental (private)",
    "property-type": "Maisonette",
    "lighting-cost-current": "96",
    "number-habitable-rooms": "6",
    "walls-description": "Solid brick, as built, no insulation (assumed)",
    "photo-supply": "",
    "lighting-cost-potential": "96",
    "roof-description": "Flat, no insulation",
    "roof-env-eff": "Very Poor",
    "built-form": "Mid-Terrace",
    "secondheat-description": "None",
    "mainheatcont-description": "Programmer, room thermostat and TRVs",
    address1: "94 Lillie Road",
    address2: "",
    "unheated-corridor-length": "",
    county: "Greater London Authority",
    "co2-emissions-current": "5.6",
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
    "heating-cost-current": "936",
    "sheating-energy-eff": "N/A",
    "windows-description": "Fully double glazed",
    "hot-water-cost-potential": "128",
    "lighting-description": "Low energy lighting in 83% of fixed outlets",
    "walls-env-eff": "Poor",
    "number-open-fireplaces": "0",
    posttown: "LONDON",
    "current-energy-rating": "D",
    "environment-impact-potential": "73",
    "floor-height": "",
    "local-authority-label": "Hammersmith and Fulham",
    "current-energy-efficiency": "60",
    "flat-top-storey": "Y",
    "sheating-env-eff": "N/A",
    "number-heated-rooms": "6",
    "energy-consumption-current": "239",
    "fixed-lighting-outlets-count": "",
    "floor-env-eff": "N/A",
    "potential-energy-rating": "C",
    "co2-emiss-curr-per-floor-area": "42",
    "mainheatc-env-eff": "Good",
    "hot-water-env-eff": "Good",
    "mainheat-description": "Boiler and radiators, mains gas",
    "hotwater-description": "From main system",
    "energy-consumption-potential": "128",
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
    "hot-water-cost-current": "168",
    "floor-level": "1st",
    "heat-loss-corridor": "no corridor",
    "glazed-type": "double glazing, unknown install date",
    "lighting-energy-eff": "Very Good",
    constituency: "E14000726",
    "low-energy-fixed-light-count": "",
    "heating-cost-potential": "479",
    tenure: "rental (private)",
    "hot-water-energy-eff": "Good",
    "environment-impact-current": "51",
    "low-energy-lighting": "83",
    "mainheat-env-eff": "Good",
  },
};
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

// Function to get aggregate data of local-authority that is stored already
const getAggregateDataOfLocalAuthority = async (localAuthority) => {
  /* NOTE Due to lack of data storage:
   * 1) would not have all local authorities
   * 2) New Local-authority only when a user registers when local-authority doesn't exist
   */
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
  };
  return await dynamoClient.get(params).promise();
};
// Testing of function getAggregateDataOfLocalAuthority
// getAggregateDataOfLocalAuthority("E09000013");

// Function to return an aggregate data given a certificate
const returnAggregateData = async (certificate) => {
  const aggregateData = {
    "local-authority": certificate["local-authority"],
    "current-energy-rating": certificate["current-energy-rating"],
    "current-energy-efficiency": certificate["current-energy-efficiency"],
    "potential-energy-rating": certificate["potential-energy-rating"],
    "potential-energy-efficiency": certificate["potential-energy-efficiency"],
    "lighting-cost-current": certificate["lighting-cost-current"],
    "lighting-cost-potential": certificate["lighting-cost-potential"],
    "co2-emissions-current": certificate["co2-emissions-current"],
    "co2-emissions-potential": certificate["co2-emissions-potential"],
    "heating-cost-current": certificate["heating-cost-current"],
    "heating-cost-potential": certificate["heating-cost-potential"],
    "environment-impact-current": certificate["environment-impact-current"],
    "environment-impact-potential": certificate["environment-impact-potential"],
    "energy-consumption-current": certificate["energy-consumption-current"],
    "energy-consumption-potential": certificate["energy-consumption-potential"],
    "low-energy-lighting": certificate["low-energy-lighting"],
    "hot-water-cost-potential": certificate["hot-water-cost-potential"],
  };
  return aggregateData;
};
// Testing function returnAggregateData
// console.log(returnAggregateData(testCertificate));

// Function to return updated aggregated data given a new certificate
const returnUpdatedAggregateData = async (
  currentAggregateData,
  oldCertificate,
  newCertificate
) => {
  /* UPDATING OF AGGREGATE DATA:
   * 1) Current aggregate data - old Certificate data + new Certificate data
   * 2) Update aggregate data
   */
  const aggregateData = {
    "local-authority": currentAggregateData.Item["local-authority"],
    "current-energy-efficiency":
      currentAggregateData.Item["current-energy-efficiency"] -
      oldCertificate.Item["current-energy-efficiency"] +
      newCertificate["current-energy-efficiency"],
    "potential-energy-efficiency":
      currentAggregateData.Item["potential-energy-efficiency"] -
      oldCertificate.Item["potential-energy-efficiency"] +
      newCertificate["potential-energy-efficiency"],
    "lighting-cost-current":
      currentAggregateData.Item["lighting-cost-current"] -
      oldCertificate["lighting-cost-current"] +
      newCertificate["lighting-cost-current"],
    "lighting-cost-potential":
      currentAggregateData.Item["lighting-cost-potential"] -
      oldCertificate["lighting-cost-potential"] +
      newCertificate["lighting-cost-potential"],
    "co2-emissions-current":
      currentAggregateData.Item["co2-emissions-current"] -
      oldCertificate.Item["co2-emissions-current"] +
      newCertificate["co2-emissions-current"],
    "co2-emissions-potential":
      currentAggregateData.Item["co2-emissions-potential"] -
      oldCertificate["co2-emissions-potential"] +
      newCertificate["co2-emissions-potential"],
    "heating-cost-current":
      currentAggregateData.Item["heating-cost-current"] -
      oldCertificate.Item["heating-cost-current"] +
      newCertificate["heating-cost-current"],
    "heating-cost-potential":
      currentAggregateData.Item["heating-cost-potential"] -
      oldCertificate.Item["heating-cost-potential"] +
      newCertificate["heating-cost-potential"],
    "environment-impact-current":
      currentAggregateData.Item["environment-impact-current"] -
      oldCertificate.Item["environment-impact-current"] +
      newCertificate["environment-impact-current"],
    "environment-impact-potential":
      currentAggregateData.Item["environment-impact-potential"] -
      oldCertificate.Item["environment-impact-potential"] +
      newCertificate["environment-impact-potential"],
    "energy-consumption-current":
      currentAggregateData.Item["energy-consumption-current"] -
      oldCertificate.Item["energy-consumption-current"] +
      newCertificate["energy-consumption-current"],
    "energy-consumption-potential":
      currentAggregateData.Item["energy-consumption-potential"] -
      oldCertificate.Item["energy-consumption-potential"] +
      newCertificate["energy-consumption-potential"],
    "low-energy-lighting":
      currentAggregateData.Item["low-energy-lighting"] -
      oldCertificate.Item["low-energy-lighting"] +
      newCertificate["low-energy-lighting"],
    "hot-water-cost-potential":
      currentAggregateData.Item["hot-water-cost-potential"] -
      oldCertificate.Item["hot-water-cost-potential"] +
      newCertificate["hot-water-cost-potential"],
  };
  aggregateData["current-energy-rating"] = await returnNewEnergyRating(
    aggregateData["current-energy-efficiency"]
  );
  aggregateData["potential-energy-rating"] = await returnNewEnergyRating(
    aggregateData["potential-energy-efficiency"]
  );
  return aggregateData;
};
// TODO: WRITE TEST FOR FUNCTION returnUpdatedAggregateData

// Function to return new aggregated data after adding a new certificate to existing local-authority
const returnNewAggregateData = async (
  newCertificate,
  currentAggregateData,
  oldNumberOfLmkKeysInLocalAuthority
) => {
  /* Updating aggregate data:
   * NUMERICAL VALUES:
   * newValue = (oldNumberOfLmkKeysInLocalAuthority * oldValue + certficateValue) / (oldNumberOfLmkKeysInLocalAuthority+1)
   * ENERGY RATINGS: -> returnNewEnergyRating
   */
  // console.log("Currently: ", currentAggregateData);
  const aggregateData = {
    "local-authority": currentAggregateData.Item["local-authority"],
    "current-energy-efficiency": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["current-energy-efficiency"]) +
        Number(newCertificate["current-energy-efficiency"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "potential-energy-efficiency": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["potential-energy-efficiency"]) +
        Number(newCertificate["potential-energy-efficiency"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "lighting-cost-current": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["lighting-cost-current"]) +
        Number(newCertificate["lighting-cost-current"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "lighting-cost-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["lighting-cost-potential"]) +
        Number(newCertificate["lighting-cost-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "co2-emissions-current": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["co2-emissions-current"]) +
        Number(newCertificate["co2-emissions-current"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "co2-emissions-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["co2-emissions-potential"]) +
        Number(newCertificate["co2-emissions-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "heating-cost-current": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["heating-cost-current"]) +
        Number(newCertificate["heating-cost-current"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "heating-cost-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["heating-cost-potential"]) +
        Number(newCertificate["heating-cost-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "environment-impact-current": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["environment-impact-current"]) +
        Number(newCertificate["environment-impact-current"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "environment-impact-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["environment-impact-potential"]) +
        Number(newCertificate["environment-impact-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "energy-consumption-current": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["energy-consumption-current"]) +
        Number(newCertificate["energy-consumption-current"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "energy-consumption-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["energy-consumption-potential"]) +
        Number(newCertificate["energy-consumption-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "low-energy-lighting": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["low-energy-lighting"]) +
        Number(newCertificate["low-energy-lighting"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
    "hot-water-cost-potential": (
      (oldNumberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["hot-water-cost-potential"]) +
        Number(newCertificate["hot-water-cost-potential"])) /
      (oldNumberOfLmkKeysInLocalAuthority + 1)
    ).toString(),
  };
  aggregateData["current-energy-rating"] = await returnNewEnergyRating(
    aggregateData["current-energy-efficiency"]
  );
  aggregateData["potential-energy-rating"] = await returnNewEnergyRating(
    aggregateData["potential-energy-efficiency"]
  );
  return aggregateData;
};
// Testing function returnNewAggregateData
// getAggregateDataOfLocalAuthority("E09000013").then((currentAggregateData) => {
//   returnNewAggregateData(fakeNewCertificate, currentAggregateData, 2).then(
//     (result) => {
//       console.log(result);
//     }
//   );
// });

// Function to add local-authority to database
const addAggregateDataOfLocalAuthority = async (aggregateData) => {
  const params = {
    TableName: TABLE_NAME,
    Item: aggregateData,
  };
  // use client to call a put method
  return await dynamoClient.put(params).promise();
};
// Testing function addAggregateDataOfLocalAuthority
// const found = returnAggregateData(testCertificate).then(async (result) => {
//   addAggregateDataOfLocalAuthority(result);
// });

// Function to add new certificate data (aggregate) to existing local-authority
const addNewAggregateDataToExistingLocalAuthority = async (
  newCertificate,
  localAuthority,
  currentAggregateData,
  oldNumberOfLmkKeysInLocalAuthority
) => {
  // Get the new aggregated data
  const aggregateData = await returnNewAggregateData(
    newCertificate,
    currentAggregateData,
    oldNumberOfLmkKeysInLocalAuthority
  );

  // Update aggregate-data table
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
    Item: aggregateData,
  };
  await dynamoClient.update(params).promise();
};

const updateAggregateDataOfExistingLocalAuthority = async (
  newCertificate,
  lmkKey,
  localAuthority,
  currentAggregateData
) => {
  // TODO: Do this function whenever user updates EPC data, do it before updating epc-certificates table

  // Get oldCertificate before updating
  const oldCertificate = await getCertificateByLmkKey(lmkKey);

  const aggregateData = await returnUpdatedAggregateData(
    currentAggregateData,
    oldCertificate,
    newCertificate
  );

  // Update aggregate-data table
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
    Item: aggregateData,
  };
  await dynamoClient.update(params).promise();
};

// Function to update aggregate data of local-authority
const updateAggregateDataOfLocalAuthority = async (certificate) => {
  /* Update localAuthority aggregate data everytime:
   * 1) a new user registers
   * CASE 1a) Local-authority exists already -> addNewAggregateDataToExistingLocalAuthority
   * CASE 1b) Local-authority does not exist -> addAggregateDataOfLocalAuthority
   * CASE 2) existing user updates epc data -> updateAggregateDataOfExistingLocalAuthority
   */

  // Get the lmk-key of the certificate
  console.log("Cert:", certificate);
  const lmkKey = certificate["lmk-key"];

  // Get the local-authority of the certificate
  const localAuthority = certificate["local-authority"];

  // Determine if local-authority is in database
  const found = getAggregateDataOfLocalAuthority(localAuthority);
  found.then(async (currentAggregateData) => {
    if (currentAggregateData.Item) {
      console.log("Local-authority exists!");

      // Determine if current lmk-key is present in respective local-authority of local-authorities table
      const lmkKeys = await (
        await getLocalAuthorityInformation(localAuthority)
      ).Item["lmkKeys"];
      if (lmkKeys.includes(lmkKey)) {
        // CASE 2: existing user updates epc data
        await updateAggregateDataOfExistingLocalAuthority(
          certificate,
          lmkKey,
          localAuthority,
          currentAggregateData
        );
      } else {
        // CASE 1a: Local-authority exists already
        await addNewAggregateDataToExistingLocalAuthority(
          certificate,
          localAuthority,
          currentAggregateData,
          lmkKeys.length
        );

        // Add new lmkkey and propertyInfo to existing local authority in local-authorities table
        const newPropertyInfo = {
          lmkKey: lmkKey,
          lat: certificate["lat"],
          lng: certificate["lng"],
          currentEnergyEfficiency: certificate["current-energy-efficiency"],
          potentialEnergyEfficiency: certificate["potential-energy-efficiency"],
        };
        console.log(
          "Adding new property info: ",
          JSON.stringify(newPropertyInfo)
        );
        await addLmkKeyAndPropertyInfoToExistingLocalAuthority(
          localAuthority,
          lmkKey,
          newPropertyInfo
        );
      }

      // Update the frequency of energy ratings in local-authorities table
      await updateFrequencyOfEnergyRating(localAuthority);
    } else {
      // CASE 1b: Local-authority does not exist
      console.log(
        "Local-authority does not exist, creating new item in aggregate-data table"
      );

      // Create new propertyInfo
      const newPropertyInfo = {
        lmkKey: lmkKey,
        lat: certificate["lat"],
        lng: certificate["lng"],
        currentEnergyEfficiency: certificate["current-energy-efficiency"],
        potentialEnergyEfficiency: certificate["potential-energy-efficiency"],
      };

      // ADD new local-authority to local-authorities table
      await addNewLocalAuthority(
        localAuthority,
        lmkKey,
        newPropertyInfo,
        certificate["current-energy-rating"],
        certificate["potential-energy-rating"]
      );

      // Get the relevant data that we are interested in aggregating
      const aggregateData = await returnAggregateData(certificate);

      // Add new local-authority to aggregate-data table
      await addAggregateDataOfLocalAuthority(aggregateData);
    }
  });
};
// Testing function updateAggregateDataOfLocalAuthority
// updateAggregateDataOfLocalAuthority(fakeNewCertificate);

module.exports = {
  router,
  dynamoClient,
  getAggregateDataOfLocalAuthority,
  updateAggregateDataOfLocalAuthority,
};
