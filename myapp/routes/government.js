const { getAggregateDataOfLocalAuthority } = require("./dynamo-aggregate");
const { getCertificateByLmkKey } = require("./dynamo-certs");
const { getLocalAuthorityInformation } = require("./dynamo-local-authorities");

const router = require("express").Router();

// router.route("/").get((req, res, next) => {
//   res.render("map");
// });

router.route("/:localAuthority").get((req, res, next) => {
  const localAuthority = req.params.localAuthority;
  // Get the aggregated data of this localAuthority
  getAggregateDataOfLocalAuthority(localAuthority).then(async (result) => {
    if (result.Item) {
      const localAuthorityInformation = await getLocalAuthorityInformation(
        localAuthority
      );
      // There is an existing local-authority
      if ("propertiesInfo" in localAuthorityInformation.Item) {
        // Coordinates of properties within this local-authority exist already
        const propertiesInfo = localAuthorityInformation.Item["propertiesInfo"];
        res.render("map", {
          propertiesInfo: propertiesInfo,
        });
      } else {
        // Get all the lmk-keys
        const lmkKeys = await (
          await getLocalAuthorityInformation(localAuthority)
        ).Item["lmkKeys"];

        var propertiesInfo = [];
        // Go through each lmk-key and add latlong coordinates if valid
        for (const lmkKey of lmkKeys) {
          const certificate = await getCertificateByLmkKey(lmkKey);
          if (certificate.Item && certificate.Item["lat"] !== null) {
            // console.log(
            //   "lmk-key: " +
            //     lmkKey +
            //     " has lat: " +
            //     certificate.Item["lat"] +
            //     " and long: " +
            //     certificate.Item["lng"]
            // );

            // add latlong coordinates and the energy ratings
            const propertyInfo = {
              lat: certificate.Item["lat"],
              lng: certificate.Item["lng"],
              currentEnergyRating: certificate.Item["current-energy-rating"],
              potentialEnergyRating:
                certificate.Item["potential-energy-rating"],
            };
            propertiesInfo.push(propertyInfo);
            console.log(propertyInfo);
          }
        }
        res.send(propertiesInfo);
      }
    } else {
      res.send("There are currently no properties under this local-authority");
    }
  });
});

module.exports = router;
