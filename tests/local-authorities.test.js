const request = require("supertest");
const app = require("../app");

const validLocalAuthority = "E09000013";

describe(`Map of Local Authority: ${validLocalAuthority}`, () => {
  it(`GET /map/${validLocalAuthority} should return Leaflet.js map, Chart.js charts, and information on its properties`, () => {
    return request(app)
      .get(`/map/${validLocalAuthority}`)
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then((res) => {
        expect(res.text.includes('div id="map"'));
        expect(res.text.includes('div class="chartjs-size-monitor"'));
        expect(res.text.includes('class="leaflet-marker-icon'));
      });
  });
});
