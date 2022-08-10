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
const TABLE_NAME = "epc-completed-recommendations";

const getAllCompletedRecommendations = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.scan(params).promise();
};

const getCompletedRecommendationsByLmkKey = async (lmkKey) => {
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

const getCompletedRecommendationByLmkKeyAndImprovementId = async (
  lmkKey,
  improvementId
) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
      "improvement-id": improvementId,
    },
  };
  // console.log(params);
  return await dynamoClient.get(params).promise();
};

const addCompletedRecommendation = async (recommendation) => {
  const params = {
    TableName: TABLE_NAME,
    Item: recommendation,
  };
  // console.log(params);
  // use client ot call a put method
  return await dynamoClient.put(params).promise();
};

module.exports = {
  dynamoClient,
  getAllCompletedRecommendations,
  getCompletedRecommendationsByLmkKey,
  getCompletedRecommendationByLmkKeyAndImprovementId,
  addCompletedRecommendation,
};
