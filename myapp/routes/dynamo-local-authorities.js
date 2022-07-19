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
const TABLE_NAME = "local-authorities";

// Function to get list of lmkKeys from local-authority
const getLmkKeysUsingLocalAuthority = async (localAuthority) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
  };
  return await dynamoClient.get(params).promise();
};
// Testing function getLmkKeysUsingLocalAuthority
// getLmkKeysUsingLocalAuthority("E09000013").then((result) => {
//   console.log(result);
// });

// Function to add a new local-authority
const addNewLocalAuthority = async (localAuthority, lmkKey) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      "local-authority": localAuthority,
      lmkKeys: [lmkKey],
    },
  };
  console.log(
    "New local-authority added into local-authorities table: ",
    localAuthority
  );
  // use client to call a put method
  return await dynamoClient.put(params).promise();
};
// Test function addNewLocalAuthority
// addNewLocalAuthority("E09000013", "1573380469022017090821481343938953");

// Function to add lmkKey to existing local-authority
const addLmkKeyToExistingLocalAuthority = async (localAuthority, lmkKey) => {
  // Get array of existing lmkKeys
  const lmkKeys = await (
    await getLmkKeysUsingLocalAuthority(localAuthority)
  ).Item["lmkKeys"];

  // Add new lmkKey to lmkKeys array
  lmkKeys.push(lmkKey);
  console.log("lmkKeys array: ", lmkKeys);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      "local-authority": localAuthority,
    },
    UpdateExpression: "set lmkKeys = :x",
    ExpressionAttributeValues: {
      ":x": lmkKeys,
    },
  };

  await dynamoClient.update(params).promise();
};
// Testing function addLmkKeyToExistingLocalAuthority
// addLmkKeyToExistingLocalAuthority("E09000013", "123");

module.exports = {
  dynamoClient,
  getLmkKeysUsingLocalAuthority,
  addNewLocalAuthority,
  addLmkKeyToExistingLocalAuthority,
};
