const AWS = require("aws-sdk");
require("dotenv").config();

// connection to AWS
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create client to conenct to document store for DynamoDB
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "smart-meter";

// Function to add a new smart meter to the table
const addSmartMeter = async (smartMeterInformation) => {
  const params = {
    TableName: TABLE_NAME,
    Item: smartMeterInformation,
  };
  return await dynamoClient.put(params).promise();
};

// Function to get all the smart meter information using lmk-key
const getSmartMeterInformationByLmkKey = async (lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#lk": "lmk-key",
    },
    ExpressionAttributeValues: {
      ":lk": lmkKey,
    },
    KeyConditionExpression: "#lk = :lk",
  };
  // console.log(params);
  return await dynamoClient.query(params).promise();
};
// Testing function getSmartMeterInformationByLmkKey
// getSmartMeterInformationByLmkKey("1573380469022017090821481343938953").then(
//   async (res) => {
//     console.log(res);
//   }
// );

// Function to get smart meter information using lmk-key and serialNumber
const getSmartMeterInformationByLmkKeyAndSerialNumber = async (
  lmkKey,
  serialNumber
) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
      "serial-number": serialNumber,
    },
  };
  return await (
    await dynamoClient.get(params).promise()
  ).Item;
};
// Testing function getSmartMeterInformationByLmkKeyAndSerialNumber
// getSmartMeterInformationByLmkKeyAndSerialNumber("1573380469022017090821481343938953", "2000024512368").then(
//   async (res) => {
//     if (res) {
//       console.log("Smart meter information: ", res);
//     } else {
//       console.log("No smart-meter information for this lmk-key");
//     }
//   }
// );

module.exports = {
  dynamoClient,
  addSmartMeter,
  getSmartMeterInformationByLmkKey,
  getSmartMeterInformationByLmkKeyAndSerialNumber,
};
