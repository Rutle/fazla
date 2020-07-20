import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  [name: string]: any;
  hullType: { [key: string]: boolean };
  nationality: { [key: string]: boolean };
  rarity: { [key: string]: boolean };
} = {
  name: '',
  hullType: {
    Destroyer: false,
    'Light Cruiser': false,
    'Heavy Cruiser': false,
    Battlecruiser: false,
    Battleship: false,
    'Light Aircraft Carrier': false,
    'Aircraft Carrier': false,
    Monitor: false,
    'Repair Ship': false,
    Submarine: false,
    'Submarine Carrier': false,
    'Large Cruiser': false,
  },
  nationality: {
    'Sakura Empire': false,
    'Eagle Union': false,
    'Royal Navy': false,
    Ironblood: false,
    'Eastern Radiance': false,
    'North Union': false,
    'Iris Libre': false,
    'Vichya Dominion': false,
    'Sardegna Empire': false,
  },
  rarity: {
    Normal: false,
    Rare: false,
    Elite: false,
    'Super Rare': false,
  },
};

const searchParametersSlice = createSlice({
  name: 'searchParametersSlice',
  initialState,
  reducers: {
    toggleParameter(state, action: PayloadAction<{ cat: string; param: string }>) {
      const { cat, param } = action.payload;
      console.log('search parameter slice: ', action.payload, 'new value: ', !state[cat][param]);
      return { ...state, [cat]: { [param]: !state[cat][param] } };
    },
    setSearchString(state, action: PayloadAction<{ str: string }>) {
      return { ...state, name: action.payload.str };
    },
    resetParameters() {
      return initialState;
    },
  },
});

export const { resetParameters, toggleParameter, setSearchString } = searchParametersSlice.actions;

export default searchParametersSlice.reducer;
