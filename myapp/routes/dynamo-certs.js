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
  return await dynamoClient.get(params).promise();
};

const addCertificate = async (certificate) => {
  const params = {
    TableName: TABLE_NAME,
    Item: certificate,
  };
  // use client to call a put method
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

// Testing finding of certificate by lmk-key
// const found = getCertificateByLmkKey("1573380469022017090821481343938953").then(
//   (result) => {
//     console.log(result);
//   }
// );

module.exports = {
  dynamoClient,
  getCertificates,
  getCertificateByLmkKey,
  addCertificate,
  deleteCertificateByLmkKey,
};
