const { getCertificateByLmkKey } = require("./dynamo-epc-certificates");
const {
  getSmartMeterInformationByLmkKeyAndSerialNumber,
  addSmartMeter,
} = require("./dynamo-smart-meter");

const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    console.log(req.query);
    const lmkKey = req.query["lmk-key"];
    const serialNumber = req.query["serial-number"];
    // Check if lmk-key and serial-number is present in query
    if (lmkKey.length === 0 || serialNumber.length === 0) {
      return res.status(422).send("Invalid query parameters");
    }
    // Check if there is existing smart-meter in database
    getSmartMeterInformationByLmkKeyAndSerialNumber(lmkKey, serialNumber).then(
      async (result) => {
        if (result) {
          var data = {};
          // do not send electricity and gas consumption
          data["lmk-key"] = lmkKey;
          data["serial-number"] = serialNumber;
          data["intervalStart"] = result.intervalStart;
          res.send(data);
        } else {
          res
            .status(404)
            .send(
              "There is no smart meter information by the given lmk-key and serial-number"
            );
        }
      }
    );
  })
  .post(async (req, res, next) => {
    // Ensure that all parameters are present
    if (
      typeof req.body.lmkKey === "undefined" ||
      typeof req.body.serialNumber === "undefined" ||
      typeof req.body.intervalStart === "undefined" ||
      typeof req.body.electricityConsumption === "undefined" ||
      typeof req.body.gasConsumption === "undefined"
    ) {
      return res.status(422).send("Missing query parameters");
    }

    // Ensure that parameters are valid
    if (
      req.body.lmkKey.length === 0 ||
      req.body.serialNumber.length === 0 ||
      !isIsoDate(req.body.intervalStart) ||
      !isNumeric(req.body.electricityConsumption) ||
      !isNumeric(req.body.gasConsumption)
    ) {
      return res.status(422).send("Invalid query parameters");
    }

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
    console.log(smartMeterInformation);

    // Check if there is existing smart-meter in database
    getSmartMeterInformationByLmkKeyAndSerialNumber(lmkKey, serialNumber).then(
      async (result) => {
        if (result) {
          // Update existing smart-meter information
          await addSmartMeter(smartMeterInformation);
          res.status(201).json({
            successMessage: "Updated existing smart-meter",
            "lmk-key": lmkKey,
            "serial-number": serialNumber,
            intervalStart,
            electricityConsumption,
            gasConsumption,
          });
        } else {
          // Check that there is an existing epc-certificate in database
          getCertificateByLmkKey(lmkKey).then(async (result) => {
            if (result) {
              // Add new smart-meter into database
              await addSmartMeter(smartMeterInformation);
              res.status(201).json({
                successMessage: "New smart-meter",
                "lmk-key": lmkKey,
                "serial-number": serialNumber,
                intervalStart,
                electricityConsumption,
                gasConsumption,
              });
            } else {
              // No epc-certificate present
              res
                .status(412)
                .send(
                  "There is no EPC Certificate to add smart meter information to"
                );
            }
          });
        }
      }
    );
  });

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date
}

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

module.exports = router;
