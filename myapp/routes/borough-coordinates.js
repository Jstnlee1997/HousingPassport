const { default: axios } = require("axios");
const fs = require("fs");

const boroughMapURL = "https://www.openstreetmap.org/api/0.6/relation/184484";

const getAllWaysOfRelation = async () => {
  const res = await axios.get(boroughMapURL);
  return res.data.elements[0].members;
};

const getAllNodesFromEachWay = async (way) => {
  const wayURL = "https://www.openstreetmap.org/api/0.6/way/" + way;
  const res = await axios.get(wayURL);
  return res.data.elements[0].nodes.length;
};

// getAllNodesFromEachWay(972812225).then((res) => {
//   console.log(res);
// });

const getAllLongLatFromEachNode = async (node) => {
  const nodeURL = "https://www.openstreetmap.org/api/0.6/node/" + node;
  const res = await axios.get(nodeURL);

  // return long and lat coordinates
  const outputString =
    res.data.elements[0].lat + " " + res.data.elements[0].lon;
  console.log(outputString);
  return outputString;
};

const returnLongLatFromRelation = async () => {
  // extract all the ways from the reference
  const members = await getAllWaysOfRelation();
  var ways = [];
  for (const member of members) {
    ways.push(member.ref);
  }

  // Go through each way and get all the nodes
  var allTheLongLatCoordinates = [];
  const nodes = await getAllNodesFromEachWay(ways[6]);
  console.log("Nodes; ", nodes);
  for (const node of nodes) {
    const longLatCoordinates = await getAllLongLatFromEachNode(node);
    fs.appendFile(
      "/Users/jstnl/GitHub/HousingPassport/myapp/public/borough-coordinates.txt",
      longLatCoordinates + "\n",
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  }
  return allTheLongLatCoordinates;
};

// returnLongLatFromRelation().then(async (res) => {
//   console.log(res);
// });
