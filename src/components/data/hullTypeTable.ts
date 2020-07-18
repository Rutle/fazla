export interface Pair {
  [key: string]: string;
}

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
  'Aircraft Carrier': 'Aircraft Carrier',
  Monitor: 'Monitor',
  'Ayanami subclass': 'Destroyer',
  'Akatsuki subclass': 'Destroyer',
  'Repair Ship': 'Repair Ship',
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
  'Aircraft Carrier': 'CV',
  Monitor: 'BM',
  'Repair Ship': 'AR',
  Submarine: 'SS',
  'Submarine Carrier': 'SSV',
  'Large Cruiser': 'CB',
};
