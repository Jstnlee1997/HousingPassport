const { result } = require("lodash");
const { getCertificateByLmkKey } = require("./dynamo-certs");
const {
  getSmartMeterInformation,
  addSmartMeter,
} = require("./dynamo-smart-meter");

const router = require("express").Router();

router
  .route("/:lmkKey")
  .get((req, res, next) => {
    // Check if there is existing smart-meter in database
    getSmartMeterInformation(req.params.lmkKey).then(async (result) => {
      if (result.Item) {
        res.send(result.Item);
      } else {
        res
          .status(404)
          .send("There is no smart meter information by the given lmk-key");
      }
    });
  })
  .post((req, res, next) => {
    const lmkKey = req.params.lmkKey;
    const smartMeterSerialNumber = req.body.smartMeterSerialNumber;
    const intervalStart = req.body.intervalStart;
    const electricityConsumption = req.body.electricityConsumption;
    const gasConsumption = req.body.electricityConsumption;
    const smartMeterInformation = {
      "lmk-key": lmkKey,
      smartMeterSerialNumber: smartMeterSerialNumber,
      intervalStart: intervalStart,
      electricityConsumption: electricityConsumption,
      gasConsumption: gasConsumption,
    };

    // Check if there is existing smart-meter in database
    getSmartMeterInformation(lmkKey).then(async (result) => {
      if (result.Item) {
        // Update existing smart-meter information
        await addSmartMeter(smartMeterInformation);
        res.status(200)
          .send(`Updating existing smart meter with lmk-key: ${lmkKey}
            Serial Number: ${smartMeterSerialNumber}
            Interval Start: ${intervalStart}
            Electricity Consumption: ${electricityConsumption}
            Gas Consumption: ${gasConsumption}`);
      } else {
        // Check that there is an existing epc-certificate in database
        getCertificateByLmkKey(lmkKey).then(async (result) => {
          if (result) {
            // Add new smart-meter into database
            await addSmartMeter(smartMeterInformation);
            res.status(200).send(`New smart meter saved with lmk-key: ${lmkKey}
              Serial Number: ${smartMeterSerialNumber}
              Interval Start: ${intervalStart}
              Electricity Consumption: ${electricityConsumption}
              Gas Consumption: ${gasConsumption}`);
          } else {
            // No epc-certificate present
            res
              .status(404)
              .send(
                "There is no EPC Certificate to add smart meter information to"
              );
          }
        });
      }
    });
  });

module.exports = router;
