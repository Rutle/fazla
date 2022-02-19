export type Pair = {
  [key: string]: string;
};

export type SlotType = {
  [key: string]: string[][];
};

export const fleets: { MAIN: string[]; VANGUARD: string[]; SUBS: string[] } = {
  MAIN: [
    'Battlecruiser',
    'Battleship',
    'Light Aircraft Carrier',
    'Aircraft Carrier',
    'Monitor',
    'Repair',
    'Light Carrier',
  ],
  VANGUARD: ['Destroyer', 'Light Cruiser', 'Heavy Cruiser', 'Large Cruiser'],
  SUBS: ['Submarine'],
};

export const nationCategories: Pair = {
  'Royal Navy': 'HMS',
  'Sakura Empire': 'IJN',
  'Iron Blood': 'KMS',
  'Northern Parliament': 'SN',
  'Eagle Union': 'USS',
  'Iris Libre': 'FFNF',
  'Vichya Dominion': 'MNF',
  'Sardegna Empire': 'RN',
  Universal: 'UNI',
  Neptunia: 'NEP',
  Bilibili: 'BIL',
  Utawarerumono: 'UTA',
  'Kizuna AI': 'KA',
  Hololive: 'HOL',
};

export const rarityCategories: string[] = [
  'Normal',
  'Rare',
  'Elite',
  'Super Rare',
  'Ultra Rare',
  'Unreleased',
  'Priority',
  'Decisive',
];

export const hullTypes: Pair = {
  Destroyer: 'Destroyer',
  'Light Cruiser': 'Light Cruiser',
  'Southampton subclass': 'Light Cruiser',
  'Edinburgh subclass': 'Light Cruiser',
  'London subclass': 'Heavy Cruiser',
  'Kent subclass': 'Heavy Cruiser',
  'Norfolk subclass': 'Heavy Cruiser',
  'Heavy Cruiser': 'Heavy Cruiser',
  Battlecruiser: 'Battlecruiser',
  Battleship: 'Battleship',
  // 'Light Aircraft Carrier': 'Light Aircraft Carrier',
  'Light Carrier': 'Light Carrier',
  'Aircraft Carrier': 'Aircraft Carrier',
  Monitor: 'Monitor',
  'Ayanami subclass': 'Destroyer',
  'Akatsuki subclass': 'Destroyer',
  // 'Repair Ship': 'Repair Ship',
  Repair: 'Repair',
  'St. Louis subclass': 'Light Cruiser',
  Submarine: 'Submarine',
  // 'Submarine Carrier': 'Submarine Carrier',
  'A subclass': 'Destroyer',
  'B subclass': 'Destroyer',
  'Large Cruiser': 'Large Cruiser',
};

export const hullTypesAbb: Pair = {
  Destroyer: 'DD',
  'Light Cruiser': 'CL',
  'Heavy Cruiser': 'CA',
  Battlecruiser: 'BC',
  Battleship: 'BB',
  // 'Light Aircraft Carrier': 'CVL',
  'Light Carrier': 'CVL',
  'Aircraft Carrier': 'CV',
  Monitor: 'BM',
  // 'Repair Ship': 'AR',
  Repair: 'AR',
  Submarine: 'SS',
  // 'Submarine Carrier': 'SSV',
  'Large Cruiser': 'CB',
};

// Slot types on ships
// in the form of type found on ship data as key
// and value as array containing 1 or 2 ID arrays of equipment.
// First array is for non-retrofit slot and array for retrofit slot.
export const slotTypes: SlotType = {
  'DD Guns': [['001']],
  Torpedoes: [['007']],
  'Anti-Air Guns': [['013']],
  'BB Guns': [['006']],
  'CL Guns': [['002']],
  'CA Guns': [['003']],
  Fighters: [['009']],
  'Dive Bombers': [['010']],
  'Torpedo Bombers': [['011']],
  Auxiliaries: [['016']],
  'Submarine Torpedoes': [['008']],
  'CL/DD Guns': [['002', '001']],
  'Fighters / Dive Bombers (MLB)': [['009', '010']],
  'CA/CB Guns': [['003', '004']],
  'CL Guns / Dive Bombers': [['002', '010']],
  'CL/DD Guns (Seaplanes on retrofit)': [['002', '001'], ['012']],
  'Dive Bombers / Torpedo Bombers (MLB)': [['010', '011']],
  Seaplanes: [['012']],
  'CL Guns / DD Guns (LB2)': [['002', '001']],
  'Auxiliaries / Cargo': [['016']],
  'CA/CL Guns': [['003', '002']],
  'DD Guns (Fighters on LB1)': [['001', '009']],
  'Torpedoes / DD Guns (retrofit)': [['007'], ['007', '001']],
  'CL Guns (CA Guns on retrofit)': [['002'], ['002', '003']],
  'CL Guns (DD Guns on retrofit)': [['002'], ['002', '001']],
  'CL Guns / Anti-Air Guns': [['002', '013']],
  'Fighters / Dive Bombers (LB1) / Torpedo Bombers (LB1)': [['009', '010', '011']],
  'Submarine-mounted 203mm Gun': [['005']],
  'CA/283mm CB Gun': [['003', '004']],
};

// Slot types on equipment.
// Custom ID given for each equipment type,
// which then can be used to identify slots
// on ships.
export const eqTypes: Pair = {
  '001': 'DD Gun',
  '002': 'CL Gun',
  '003': 'CA Gun',
  '004': 'CB Gun',
  '005': 'SS Gun',
  '006': 'BB Gun',
  '007': 'Torpedo',
  '008': 'Submarine Torpedo',
  '009': 'Fighter',
  '010': 'Dive Bomber',
  '011': 'Torpedo Bomber',
  '012': 'Seaplane',
  '013': 'AA Gun',
  '014': 'Depth Charge',
  '015': 'Sonar',
  '016': 'Auxiliary',
  '017': 'ASW Bomber',
  '018': 'ASW Helicopter',
};

export const statsAbb: { [key: string]: string } = {
  health: 'HP',
  armor: 'AR',
  reload: 'RLD',
  luck: 'LCK',
  firepower: 'FP',
  torpedo: 'TRP',
  evasion: 'EVA',
  speed: 'SPD',
  antiair: 'AA',
  aviation: 'AVI',
  oilConsumption: 'Cost',
  accuracy: 'ACC',
  antisubmarineWarfare: 'ASW',
  oxygen: 'OXY',
  ammunition: 'AMO',
  huntingRange: 'ASR',
};

export const statCatAbb: { [key: string]: string } = {
  baseStats: 'Base',
  level100: '100',
  level120: '120',
  level100Retrofit: '100R',
  level120Retrofit: '120R',
};
