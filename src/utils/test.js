const fs = require('fs');
const shipData = require('../data/ships.json');
const eqData = require('../data/equipments.json');

function checkHullType() {
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
  fs.writeFile('hulltype.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}

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
  fs.writeFile('nationality.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}

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
  fs.writeFile('rarity.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}


function checkSkills() {
  const jsonObject = {};
  Object.keys(shipData).forEach((ele, idx) => {
    const ship = shipData[ele];
    // if (idx === 0) console.log(ship);
    if (ship.names === undefined) {
      console.log('skills undefined')
      if (jsonObject.nonames === undefined) {
        console.log('eka1');
        jsonObject.nonames = 1;
      } else {
        jsonObject.nonames = jsonObject.nonames + 1;
      }
      
      // console.log(ship.names);
    } else {
      if (jsonObject.names === undefined) {
        console.log('eka2')
        jsonObject.names = 1;
      } else {
        jsonObject.names = jsonObject.names + 1;
      }
      
    }
  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('skillcount.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}

function checkEqTypes() {
  const jsonObject = {};
  console.log(eqData.length);
  eqData.forEach((eq, idx) => {
    if (jsonObject[eq.type.name] === undefined) {
      jsonObject[eq.type.name] = 1;
    } else {
      jsonObject[eq.type.name] = jsonObject[eq.type.name] + 1;
    }
  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('eqTypes.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}
function checkShipEqSlotTypes() {
  const jsonObject = {};
  Object.keys(shipData).forEach((ele, idx) => {
    const ship = shipData[ele];
    ship.slots.forEach((slot) => {
      if (jsonObject[slot.type] === undefined) {
        jsonObject[slot.type] = 1;
      } else {
        jsonObject[slot.type] = jsonObject[slot.type] + 1;
      }
    });

  });
  const jsonStr = JSON.stringify(jsonObject);
  fs.writeFile('shipEqSlotTypes.json', jsonStr, 'utf8', (err) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}
// checkSkills();
// checkNationality();
// checkHullType();
checkShipEqSlotTypes();
checkEqTypes();