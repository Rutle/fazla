const fs = require('fs');
const path = require('path');
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
    if (ship.names === undefined) {
      console.log('skills undefined')
      if (jsonObject.nonames === undefined) {
        console.log('eka1');
        jsonObject.nonames = 1;
      } else {
        jsonObject.nonames = jsonObject.nonames + 1;
      }
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


// https://mattbatman.com/programmatically-writing-javascript-files-in-node/
// Assign custom IDs to every unique equipment to reduce the size of formation data
// when 
function createCustomEqId() {
  const data = eqData.map((eq, idx) => eq.id);
  const file = fs.createWriteStream(
    path.join(__dirname, '../data', 'eqIds.ts')
  );
  file.write('// Custom ID for each equipment.\r\n');
  file.write('// JSON eq data has long names as IDs, but I need simple number ID\r\n');
  file.write('// so that I can keep the export url length short. For that reason\r\n');
  file.write('// the JSON data is reduced to number:string key:value pairs.\r\n');
  file.write('// Programmatically created using a script in test.js\r\n');
  file.write('const eqIds = {\r\n');
  data.forEach((d, idx) => {
    file.write(`  '${idx}': '${d}'`);
    file.write(',\r\n');
  });
  file.write('};\r\n');
  file.write('\r\n');
  file.write('export default eqIds;\r\n');
  file.end();
}

function updateCustomEqId() {
  let parsedData = {};

  const data = fs.readFile(path.join(__dirname, `../data/eqIds.ts`), 'utf8', (err, data) => {
    if (err) throw err;
    parsedData = JSON.parse(data
      .replace('const eqIds =', '')
      .replace('export default eqIds;', '')
      .replace('// Custom ID for each equipment.', '')
      .replace('// JSON eq data has long names as IDs, but I need simple number ID', '')
      .replace('// so that I can keep the export url length short. For that reason', '')
      .replace('// the JSON data is reduced to number:string key:value pairs.', '')
      .replace('// Programmatically created using a script in test.js', '')
      .replace(/(\"\w+)"/g, '\\$1\"') // Words in quotation.
      .replace(/(")\//g, '\\$1/') // inch /
      .replace(/(" )/g, '\\$1') // inch
      .replace(/'(\d+)':/g, '\"$1\":') // key
      .replace(/'(.+)'/g, '\"$1\"') // put all values in quotation marks
      .replace(/\,(?=[^,]*$)/, "") // last trailing comma
      .replace('};', '}'));
    console.log(parsedData);
  });

  /*
  const file = fs.createWriteStream(
    resolve(__dirname, '../data', 'eqIds.ts')
  );
  file.write('// Custom ID for each equipment\r\n');
  file.write('// Programmatically created using a script in test.js\r\n');
  file.write('const eqIds = {\r\n');
  data.forEach((d, idx) => {
    file.write(`  ${idx}: '${d}'`);
    file.write(',\r\n');
  });
  file.write('};\r\n');
  file.write('\r\n');
  file.write('export default eqIds;\r\n');
  file.end();
  */
}


// checkSkills();
// checkNationality();
// checkHullType();
// checkShipEqSlotTypes();
// checkEqTypes();
// createCustomEqId();
updateCustomEqId();