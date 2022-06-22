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

const getRecommendations = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const recommendations = await dynamoClient.scan(params).promise();
  console.log(recommendations);
  return recommendations;
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
  console.log(params);
  return await dynamoClient.get(params).promise();
};

const addRecommendation = async (recommendation) => {
  const params = {
    TableName: TABLE_NAME,
    Item: recommendation,
  };
  console.log(params);
  // use client ot call a put method
  return await dynamoClient.put(params).promise();
};

const deleteRecommendationByLmkKey = async (lmkKey, improvementId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
      "improvement-id": improvementId,
    },
  };
  console.log(params);
  // use client ot call a delete method
  return await dynamoClient.delete(params).promise();
};

// Testing finding of recommendation by lmk-key
// getRecommendationByLmkKey(
//   "1e087cfceb2b4e4cf113af8991c2775332cf8dfdb9ceec8bbc18540c9eb2011f"
// );

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

// Test getRecommendationByLmkKeyAndImprovementId function
// const found = getRecommendationByLmkKeyAndImprovementId(
//   recommendation["lmk-key"],
//   recommendation["improvement-id"]
// ).then((result) => {
//   console.log(result);
// });

// Test getRecommendations function
// getRecommendations();

module.exports = {
  dynamoClient,
  getRecommendations,
  getRecommendationByLmkKeyAndImprovementId,
  addRecommendation,
  deleteRecommendationByLmkKey,
};
