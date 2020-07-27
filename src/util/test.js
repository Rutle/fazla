const shipData = require('../data/ships.json');
const fs = require('fs');

function checkSkills() {
  const jsonObject = {};
  Object.keys(shipData).forEach((ele, idx) => {
    const ship = shipData[ele];
    if (jsonObject[ship.hullType] === undefined) {
      jsonObject[ship.hullType] = 1;
    } else {
      jsonObject[ship.hullType] = jsonObject[ship.hullType] + 1;
    }
  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('output.json', jsonStr, 'utf8', function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}
// checkSkills();
function checkNationality() {
  const jsonObject = {};
  Object.keys(shipData).forEach((ele, idx) => {
    const ship = shipData[ele];
    if (jsonObject[ship.nationality] === undefined) {
      jsonObject[ship.nationality] = 1;
    } else {
      jsonObject[ship.nationality] = jsonObject[ship.nationality] + 1;
    }
  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('nationality.json', jsonStr, 'utf8', function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
};
// checkSkills();
function checkRarity() {
  const jsonObject = {};
  Object.keys(shipData).forEach((ele, idx) => {
    const ship = shipData[ele];
    if (jsonObject[ship.rarity] === undefined) {
      jsonObject[ship.rarity] = 1;
    } else {
      jsonObject[ship.rarity] = jsonObject[ship.rarity] + 1;
    }
  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('rarity.json', jsonStr, 'utf8', function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
};
checkRarity();