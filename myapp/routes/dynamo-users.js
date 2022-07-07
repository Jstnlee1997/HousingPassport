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
const TABLE_NAME = "users";

const addUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };
  // use client to call a put method
  return await dynamoClient.put(params).promise();
};

const getUser = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      email: email,
    },
  };
  return await dynamoClient.get(params).promise();
};

const deleteUser = async (email) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      email: email,
    },
  };
  // use client ot call a delete method
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  addUser,
  getUser,
  deleteUser,
};
