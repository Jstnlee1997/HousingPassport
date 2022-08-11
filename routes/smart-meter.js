const { getCertificateByLmkKey } = require("./dynamo-epc-certificates");
const {
  getSmartMeterInformation,
  addSmartMeter,
} = require("./dynamo-smart-meter");

const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    // Check if there is existing smart-meter in database
    console.log(req.query);
    getSmartMeterInformation(
      req.query["lmk-key"],
      req.query["serial-number"]
    ).then(async (result) => {
      if (result) {
        res.send(result);
      } else {
        res
          .status(404)
          .send(
            "There is no smart meter information by the given lmk-key and serial-number"
          );
      }
    });
  })
  .post(async (req, res, next) => {
    const lmkKey = req.body.lmkKey;
    const serialNumber = req.body.serialNumber;
    const intervalStart = new Date(req.body.intervalStart).toString();
    const electricityConsumption = req.body.electricityConsumption;
    const gasConsumption = req.body.gasConsumption;
    const smartMeterInformation = {
      "lmk-key": lmkKey,
      "serial-number": serialNumber,
      intervalStart: intervalStart,
      electricityConsumption: electricityConsumption,
      gasConsumption: gasConsumption,
    };

    // Check if there is existing smart-meter in database
    getSmartMeterInformation(lmkKey, serialNumber).then(async (result) => {
      if (result) {
        // Update existing smart-meter information
        await addSmartMeter(smartMeterInformation);
        res.status(200)
          .send(`Updating existing smart meter with lmk-key: ${lmkKey}
            Serial Number: ${serialNumber}
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
              Serial Number: ${serialNumber}
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
