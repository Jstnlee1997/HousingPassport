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

// Function to get smart meter information using lmk-key
const getSmartMeterInformation = async (lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
    },
  };
  return await dynamoClient.get(params).promise();
};

module.exports = {
  dynamoClient,
  addSmartMeter,
  getSmartMeterInformation,
};
