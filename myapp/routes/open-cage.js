const { default: axios } = require("axios");

require("dotenv").config();

const getLngLatCoordinates = async (address, postcode) => {
  const url = "https://api.opencagedata.com/geocode/v1/json?";
  const query =
    encodeURIComponent(address) + encodeURIComponent(", " + postcode);
  console.log(query);
  const countrycode = "gb";
  const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY;
  const res = await axios.get(url, {
    params: {
      q: query,
      countrycode: countrycode,
      key: OPEN_CAGE_API_KEY,
    },
  });
  try {
    return res.data.results[0].geometry;
  } catch (err) {
    console.log("Error address: " + address + ", error postcode: " + postcode);
    console.log(err);
    return { lat: null, lng: null };
  }
};
// Testing function getLonLatCoordinates
// getLngLatCoordinates("94 Acer Apartments, Belvoir Square", "W12 7LU").then(
//   async (res) => {
//     // OUTPUTS: { lat: 51.485262, lng: -0.203158 }
//     const { lat, lng } = res;
//     console.log(lat, lng);
//   }
// );

module.exports = {
  getLngLatCoordinates,
};
