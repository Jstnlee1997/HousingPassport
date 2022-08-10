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
const TABLE_NAME = "epc-recommendations";

const getAllRecommendations = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.scan(params).promise();
};

const getRecommendationsByLmkKey = async (lmkKey) => {
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

const getRecommendationByLmkKeyAndImprovementId = async (
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

const addRecommendation = async (recommendation) => {
  const params = {
    TableName: TABLE_NAME,
    Item: recommendation,
  };
  // console.log(params);
  // use client ot call a put method
  return await dynamoClient.put(params).promise();
};

const deleteRecommendationByLmkKeyAndImprovementId = async (
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
  // use client ot call a delete method
  return await dynamoClient.delete(params).promise();
};

/* Testing functions */
// var recommendation = {
//   "lmk-key": "1573380469022017090821481343938953",
//   "improvement-item": "1",
//   "indicative-cost": "£850 - £1,500",
//   "improvement-summary-text": "",
//   "improvement-descr-text": "",
//   "improvement-id": "45",
//   "improvement-id-text": "Flat roof insulation",
// };

// Test addRecommendation function
// addRecommendation(recommendation);

// Test deleteRecommendation function
// deleteRecommendationByLmkKey(
//   recommendation["lmk-key"],
//   recommendation["improvement-id"]
// );

// Test getRecommendationsByLmkKey function
// getRecommendationsByLmkKey(
//   "4974ad2ee5f8ebdbde5d9bc1ddf1199ea0dd1653614f073abe99883f61696553"
// ).then((res) => {
//   console.log(res.Items);
// });

// Test getRecommendationByLmkKeyAndImprovementId function
// const found = getRecommendationByLmkKeyAndImprovementId(
//   recommendation["lmk-key"],
//   recommendation["improvement-id"]
// ).then((result) => {
//   console.log(result);
// });

// Test getAllRecommendations function
// getAllRecommendations();

module.exports = {
  dynamoClient,
  getAllRecommendations,
  getRecommendationsByLmkKey,
  getRecommendationByLmkKeyAndImprovementId,
  addRecommendation,
  deleteRecommendationByLmkKeyAndImprovementId,
};
