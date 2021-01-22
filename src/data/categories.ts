export interface Pair {
  [key: string]: string;
}

export const fleets: { MAIN: string[]; VANGUARD: string[] } = {
  MAIN: [
    'Battlecruiser',
    'Battleship',
    'Light Aircraft Carrier',
    'Aircraft Carrier',
    'Monitor',
    'Repair Ship',
    'Light Carrier',
  ],
  VANGUARD: [
    'Destroyer',
    'Light Cruiser',
    'Southampton subclass',
    'Edinburgh subclass',
    'London subclass',
    'Kent subclass',
    'Norfolk subclass',
    'Heavy Cruiser',
    'Ayanami subclass',
    'Akatsuki subclass',
    'St. Louis subclass',
    'A subclass',
    'B subclass',
    'Large Cruiser',
  ],
};

export const nationCategories: Pair = {
  'Royal Navy': 'HMS',
  'Sakura Empire': 'IJN',
  Ironblood: 'KMS',
  'Eastern Radiance': 'ROC',
  'North Union': 'SN',
  'Eagle Union': 'USS',
  'Iris Libre': 'FFNF',
  'Vichya Dominion': 'MNF',
  'Sardegna Empire': 'RN',
  Universal: 'UNI',
  Neptunia: 'NEP',
  Bilibili: 'BIL',
  Utawarerumono: 'UTA',
  KizunaAI: 'KA',
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
  'Light Aircraft Carrier': 'Light Aircraft Carrier',
  'Light Carrier': 'Light Aircraft Carrier',
  'Aircraft Carrier': 'Aircraft Carrier',
  Monitor: 'Monitor',
  'Ayanami subclass': 'Destroyer',
  'Akatsuki subclass': 'Destroyer',
  'Repair Ship': 'Repair Ship',
  Repair: 'Repair Ship',
  'St. Louis subclass': 'Light Cruiser',
  Submarine: 'Submarine',
  'Submarine Carrier': 'Submarine Carrier',
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
  'Light Aircraft Carrier': 'CVL',
  'Light Carrier': 'CVL',
  'Aircraft Carrier': 'CV',
  Monitor: 'BM',
  'Repair Ship': 'AR',
  Repair: 'AR',
  Submarine: 'SS',
  'Submarine Carrier': 'SSV',
  'Large Cruiser': 'CB',
};
