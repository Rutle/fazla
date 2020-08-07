import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AppThunk, AppDispatch } from '../../store';
// import { batch } from 'react-redux';

export interface BooleanSearchParam {
  [key: string]: boolean;
}

export type SearchParams = {
  [key: string]: any;
  name: string;
  hullTypeArr: string[];
  nationalityArr: string[];
  rarityArr: string[];
  hullType: BooleanSearchParam;
  nationality: BooleanSearchParam;
  rarity: BooleanSearchParam;
};

const initialState: SearchParams = {
  name: '',
  hullTypeArr: [],
  nationalityArr: [],
  rarityArr: [],
  hullType: {
    All: true,
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
    All: true,
    'Sakura Empire': false,
    'Eagle Union': false,
    'Royal Navy': false,
    Ironblood: false,
    'Eastern Radiance': false,
    'North Union': false,
    'Iris Libre': false,
    'Vichya Dominion': false,
    'Sardegna Empire': false,
    Universal: false,
    Neptunia: false,
    Bilibili: false,
    Utawarerumono: false,
    KizunaAI: false,
    Hololive: false,
  },
  rarity: {
    All: true,
    Normal: false,
    Rare: false,
    Elite: false,
    'Super Rare': false,
    Unreleased: false,
    Priority: false,
    Decisive: false,
  },
};

const searchParametersSlice = createSlice({
  name: 'searchParametersSlice',
  initialState,
  reducers: {
    toggleParameter(state, action: PayloadAction<{ cat: string; param: string }>) {
      const { cat, param } = action.payload;
      const oldState = state[cat][param];
      let newArray = [];
      const newObj = {
        ...state,
        [cat]: {
          ...state[cat],
          [param]: !state[cat][param],
        },
      };
      switch (cat) {
        case 'nationality':
          if (oldState) {
            newArray = state['nationalityArr'].slice().filter((item) => item !== param);
            newObj['nationalityArr'] = newArray;
          } else {
            newArray = state['nationalityArr'].slice();
            newArray.push(param);
            newObj['nationalityArr'] = newArray;
          }
          break;
        case 'hullType':
          if (oldState) {
            newObj['hullTypeArr'] = state['hullTypeArr'].slice().filter((item) => item !== param);
          } else {
            newArray = state['hullTypeArr'].slice();
            newArray.push(param);
            newObj['hullTypeArr'] = newArray;
          }
          break;
        case 'rarity':
          if (oldState) {
            newObj['rarityArr'] = state.rarityArr.slice().filter((item) => item !== param);
          } else {
            newArray = state['rarityArr'].slice();
            newArray.push(param);
            newObj['rarityArr'] = newArray;
          }
          break;
        default:
          break;
      }
      return newObj;
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
