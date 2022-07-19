const { getAggregateDataOfLocalAuthority } = require("./dynamo-aggregate");

const router = require("express").Router();

router.route("/:localAuthority").get((req, res, next) => {
  // Get the aggregated data of this localAuthority
  getAggregateDataOfLocalAuthority(req.params.localAuthority).then(
    async (result) => {
      if (result.Item) {
        res.json(result.Item);
      } else {
        res.send(
          "There are currently no properties under this local-authority"
        );
      }
    }
  );
});

module.exports = router;
