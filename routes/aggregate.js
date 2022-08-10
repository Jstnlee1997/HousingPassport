const { getAggregateDataOfLocalAuthority } = require("./dynamo-aggregate-data");

const router = require("express").Router();

router.route("/:localAuthority").get(async (req, res, next) => {
  const localAuthority = req.params.localAuthority;
  const aggregateData = await getAggregateDataOfLocalAuthority(localAuthority);
  console.log(aggregateData);
  if (Object.keys(aggregateData).length === 0) {
    return res.status(404).send("This is not a valid local-authority.");
  }
  res.send(aggregateData.Item);
});

module.exports = router;
