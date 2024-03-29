const AWS = require("aws-sdk");
const { getCertificateByLmkKey } = require("./dynamo-epc-certificates");
const {
  addNewLocalAuthority,
  getLocalAuthorityInformation,
  addLmkKeyAndPropertyInfoToExistingLocalAuthority,
  returnNewEnergyRating,
  updateFrequencyOfEnergyRating,
  updateEnergyInfoOfProperty,
} = require("./dynamo-local-authorities");
const { getRecommendationsByLmkKey } = require("./dynamo-epc-recommendations");
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
};
const fakeNewCertificate = {
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
// getAggregateDataOfLocalAuthority("E09000020").then(async (res) => {
//   console.log(res);
// });

// Function to return an aggregate data given a certificate
const returnAggregateData = async (certificate) => {
  const aggregateData = {
    "local-authority": certificate["local-authority"],
    "local-authority-label": certificate["local-authority-label"],
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
    "energy-consumption-current": certificate["energy-consumption-current"],
    "energy-consumption-potential": certificate["energy-consumption-potential"],
    "low-energy-lighting": certificate["low-energy-lighting"],
    "hot-water-cost-potential": certificate["hot-water-cost-potential"],
  };
  return aggregateData;
};
// Testing function returnAggregateData
// returnAggregateData(testCertificate).then(async (res) => {
//   console.log(res);
// });

// Function to return updated aggregated data given a new certificate
const returnUpdatedAggregateData = async (
  currentAggregateData,
  oldCertificate,
  newCertificate,
  numberOfLmkKeysInLocalAuthority
) => {
  /* UPDATING OF AGGREGATE DATA:
   * 1) Total = numberOfLmkKeysInLocalAuthority * Current aggregate data
   * 2) Total = total - old Certificate data + new Certificate data
   * 3) New aggregate data = Total / numberOfLmkKeysInLocalAuthority
   * 4) Update aggregate data
   */
  console.log("CURRENT AGGREGATE DATA: ", currentAggregateData);

  const aggregateData = {
    "local-authority": currentAggregateData.Item["local-authority"],
    "local-authority-label": currentAggregateData.Item["local-authority-label"],
    "current-energy-efficiency": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["current-energy-efficiency"]) -
        Number(oldCertificate["current-energy-efficiency"]) +
        Number(newCertificate["current-energy-efficiency"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "potential-energy-efficiency": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["potential-energy-efficiency"]) -
        Number(oldCertificate["potential-energy-efficiency"]) +
        Number(newCertificate["potential-energy-efficiency"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "lighting-cost-current": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["lighting-cost-current"]) -
        Number(oldCertificate["lighting-cost-current"]) +
        Number(newCertificate["lighting-cost-current"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "lighting-cost-potential": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["lighting-cost-potential"]) -
        Number(oldCertificate["lighting-cost-potential"]) +
        Number(newCertificate["lighting-cost-potential"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "co2-emissions-current": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["co2-emissions-current"]) -
        Number(oldCertificate["co2-emissions-current"]) +
        Number(newCertificate["co2-emissions-current"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "co2-emissions-potential": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["co2-emissions-potential"]) -
        Number(oldCertificate["co2-emissions-potential"]) +
        Number(newCertificate["co2-emissions-potential"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "heating-cost-current": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["heating-cost-current"]) -
        Number(oldCertificate["heating-cost-current"]) +
        Number(newCertificate["heating-cost-current"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "heating-cost-potential": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["heating-cost-potential"]) -
        Number(oldCertificate["heating-cost-potential"]) +
        Number(newCertificate["heating-cost-potential"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "energy-consumption-current": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["energy-consumption-current"]) -
        Number(oldCertificate["energy-consumption-current"]) +
        Number(newCertificate["energy-consumption-current"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "energy-consumption-potential": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["energy-consumption-potential"]) -
        Number(oldCertificate["energy-consumption-potential"]) +
        Number(newCertificate["energy-consumption-potential"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "low-energy-lighting": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["low-energy-lighting"]) -
        Number(oldCertificate["low-energy-lighting"]) +
        Number(newCertificate["low-energy-lighting"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
    "hot-water-cost-potential": (
      (numberOfLmkKeysInLocalAuthority *
        Number(currentAggregateData.Item["hot-water-cost-potential"]) -
        Number(oldCertificate["hot-water-cost-potential"]) +
        Number(newCertificate["hot-water-cost-potential"])) /
      numberOfLmkKeysInLocalAuthority
    ).toString(),
  };
  aggregateData["current-energy-rating"] = await returnNewEnergyRating(
    aggregateData["current-energy-efficiency"]
  );
  aggregateData["potential-energy-rating"] = await returnNewEnergyRating(
    aggregateData["potential-energy-efficiency"]
  );
  console.log("UPDATED aggregateData: ", aggregateData);
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
  const aggregateData = {
    "local-authority": currentAggregateData.Item["local-authority"],
    "local-authority-label": currentAggregateData.Item["local-authority-label"],
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
  await dynamoClient.put(params).promise();
};

const updateAggregateDataOfExistingLocalAuthority = async (
  newCertificate,
  oldCertificate,
  localAuthority,
  currentAggregateData,
  numberOfLmkKeysInLocalAuthority
) => {
  // Get oldCertificate before updating
  const aggregateData = await returnUpdatedAggregateData(
    currentAggregateData,
    oldCertificate,
    newCertificate,
    numberOfLmkKeysInLocalAuthority
  );

  // Update aggregate-data table
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
    Item: aggregateData,
  };
  await dynamoClient.put(params).promise();
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
  // console.log("Cert:", certificate);
  const lmkKey = certificate["lmk-key"];

  // Get the local-authority of the certificate
  const localAuthority = certificate["local-authority"];

  // Get the oldCertificate for updating purposes
  const oldCertificate = await getCertificateByLmkKey(lmkKey);

  // Determine if local-authority is in database
  getAggregateDataOfLocalAuthority(localAuthority).then(
    async (currentAggregateData) => {
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
            oldCertificate,
            localAuthority,
            currentAggregateData,
            lmkKeys.length
          );

          // update propertyInfo of the updated epc-data
          await updateEnergyInfoOfProperty(
            localAuthority,
            lmkKey,
            certificate["current-energy-efficiency"],
            certificate["potential-energy-efficiency"]
          );
        } else {
          // CASE 1a: Local-authority exists already
          await addNewAggregateDataToExistingLocalAuthority(
            certificate,
            localAuthority,
            currentAggregateData,
            lmkKeys.length
          );

          // Get recommendations of the property
          const recommendations = await getRecommendationsByLmkKey(lmkKey);

          // Add new lmkkey and propertyInfo to existing local authority in local-authorities table
          const newPropertyInfo = {
            lmkKey: lmkKey,
            lat: certificate["lat"],
            lng: certificate["lng"],
            currentEnergyEfficiency: certificate["current-energy-efficiency"],
            potentialEnergyEfficiency:
              certificate["potential-energy-efficiency"],
            recommendations: recommendations,
          };
          // console.log(
          //   "Adding new property info: ",
          //   JSON.stringify(newPropertyInfo)
          // );
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

        // Get recommendations of the property
        const recommendations = await getRecommendationsByLmkKey(lmkKey);

        // Create new propertyInfo
        const newPropertyInfo = {
          lmkKey: lmkKey,
          lat: certificate["lat"],
          lng: certificate["lng"],
          currentEnergyEfficiency: certificate["current-energy-efficiency"],
          potentialEnergyEfficiency: certificate["potential-energy-efficiency"],
          recommendations: recommendations,
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
    }
  );
};
// Testing function updateAggregateDataOfLocalAuthority
// updateAggregateDataOfLocalAuthority(fakeNewCertificate);

module.exports = {
  dynamoClient,
  getAggregateDataOfLocalAuthority,
  updateAggregateDataOfLocalAuthority,
};
