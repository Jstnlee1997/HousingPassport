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
const TABLE_NAME = "epc-api";

const getCertificates = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const certificates = await dynamoClient.scan(params).promise();
  console.log(certificates);
  return certificates;
};

const getCertificateByLmkKey = async (lmkKey, localAuthority) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "lmk-key": lmkKey,
      "local-authority": localAuthority,
    },
  };
  return await dynamoClient
    .get(params)
    .promise()
    .then(function (result) {
      console.log(result);
    });
};

const addCertificate = async (certificate) => {
  const params = {
    TableName: TABLE_NAME,
    Item: certificate,
  };
  // use client ot call a put method
  return await dynamoClient.put(params).promise();
};

const deleteCertificateByLmkKey = async (lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      lmkKey,
    },
  };
  // use client ot call a delete method
  return await dynamoClient.delete(params).promise();
};

// Testing deleting of certificate by lmk-key & local-authority
// getCertificateByLmkKey(
//   "cee3477e2d6d5aee4d5780b52ab8acf30242b510bf940b342ba5614abe0f8eee",
//   "W06000012"
// );

module.exports = {
  dynamoClient,
  getCertificates,
  getCertificateByLmkKey,
  addCertificate,
  deleteCertificateByLmkKey,
};
