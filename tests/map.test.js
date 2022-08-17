const request = require("supertest");
const app = require("../app");

describe("Map of UK", () => {
  it("GET /map should return Leaflet.js map and information on Local Regions", () => {
    return request(app)
      .get("/map")
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then((res) => {
        expect(res.text.includes('div id="map"'));
        expect(res.text.includes("const localAuthorities"));
        expect(res.text.includes("const aggregateDataOfLocalAuthorities"));
        expect(res.text.includes("const latlongsOfLocalAuthorities"));
      });
  });
});
