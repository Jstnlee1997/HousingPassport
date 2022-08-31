const request = require("supertest");
const app = require("../app");

const validLmkKey = "1573380469022017090821481343938953";
const validSerialNumber = "2000024512368";

describe("Smart Meter GET Tests", () => {
  it("GET /smart-meter/?lmk-key=<lmkKey>&serial-number=<serialNumber> should return smart-meter information if valid", () => {
    return request(app)
      .get(
        `/smart-meter/?lmk-key=${validLmkKey}&serial-number=${validSerialNumber}`
      )
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            "lmk-key": validLmkKey,
            "serial-number": validSerialNumber,
            intervalStart: expect.any(String),
          })
        );
      });
  });

  it("GET /smart-meter/?lmk-key=<lmkKey>&serial-number=<serialNumber> should return 404 if missing lmk-key", () => {
    return request(app)
      .get(`/smart-meter/?lmk-key=&serial-number=${validSerialNumber}`)
      .expect(422);
  });

  it("GET /smart-meter/?lmk-key=<lmkKey>&serial-number=<serialNumber> should return 404 if missing serial-number", () => {
    return request(app)
      .get(`/smart-meter/?lmk-key=${validLmkKey}&serial-number=`)
      .expect(422);
  });

  it("GET /smart-meter/?lmk-key=<lmkKey>&serial-number=<serialNumber> should return 404 if smart-meter is not valid", () => {
    return request(app)
      .get(`/smart-meter/?lmk-key=abc&serial-number=123`)
      .expect(404);
  });
});

describe("Smart Meter POST Tests", () => {
  it("POST /smart-meter should UPDATE smart-meter data if existing smart-meter in database", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: validLmkKey,
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.050",
        gasConsumption: "0.080",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            successMessage: "Updated existing smart-meter",
            "lmk-key": validLmkKey,
            "serial-number": validSerialNumber,
            intervalStart: expect.any(String),
            electricityConsumption: expect.any(String),
            gasConsumption: expect.any(String),
          })
        );
      });
  });

  it("POST /smart-meter should ADD smart-meter data if new smart-meter AND existing epc certificate", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey:
          "fdd841b6c21f10a1e57935cdbec94fbccc486f8798d06803d64abe28811f35ee",
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.070",
        gasConsumption: "0.070",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            "lmk-key":
              "fdd841b6c21f10a1e57935cdbec94fbccc486f8798d06803d64abe28811f35ee",
            "serial-number": validSerialNumber,
            intervalStart: expect.any(String),
            electricityConsumption: expect.any(String),
            gasConsumption: expect.any(String),
          })
        );
      });
  });

  it("POST /smart-meter should return 422 if lmkKey is blank", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.070",
        gasConsumption: "0.070",
      })
      .expect(422);
  });

  it("POST /smart-meter should return 422 if serialNumber is blank", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: validLmkKey,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.070",
        gasConsumption: "0.070",
      })
      .expect(422);
  });

  it("POST /smart-meter should return 422 if intervalStart is not in ISO format", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: "123",
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00+0100",
        electricityConsumption: "0.070",
        gasConsumption: "0.070",
      })
      .expect(422);
  });

  it("POST /smart-meter should return 422 if electricityConsumption is not a number", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: "123",
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "hello",
        gasConsumption: "0.070",
      })
      .expect(422);
  });

  it("POST /smart-meter should return 422 if gasConsumption is not a number", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: "123",
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.070",
        gasConsumption: "hello",
      })
      .expect(422);
  });

  it("POST /smart-meter should return 412 if there is no valid EPC certificate in the database", () => {
    return request(app)
      .post("/smart-meter")
      .send({
        lmkKey: "123",
        serialNumber: validSerialNumber,
        intervalStart: "2022-08-16T18:00:00.000Z",
        electricityConsumption: "0.070",
        gasConsumption: "0.070",
      })
      .expect(412);
  });
});
