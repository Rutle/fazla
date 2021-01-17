import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { isBooleanObj } from '_/utils/appUtilities';
import { AppThunk, AppDispatch } from '_reducers/store';
import DataStore from '../../utils/dataStore';
import { BooleanSearchParam, SearchParams, ShipSimple } from '../../utils/types';
import { setErrorMessage, setListState, toggleSearchState } from './appStateSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { removeShip } from './ownedShipListSlice';
import { setDetails, resetDetails } from './shipDetailsSlice';
import { setSearchList } from './shipSearchListSlice';

export enum SearchAction {
  ToggleParameter = 'TOGGLEPARAMETER',
  ToggleAll = 'TOGGLEALL',
  SetName = 'SETNAME',
  UpdateList = 'UPDATE',
  RemoveShip = 'REMOVE',
}

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
  fleet: 'ALL',
};

const searchParametersSlice = createSlice({
  name: 'searchParametersSlice',
  initialState,
  reducers: {
    toggleParameter(state, action: PayloadAction<{ cat: string; param: string }>) {
      const { cat, param } = action.payload;
      // const oldState = state;
      // const val = oldState[cat];
      const od = state[cat] as BooleanSearchParam;
      const oldVal = od[param];
      // const oldState = state[cat][param] as boolean;
      let newArray = [];
      /*
      const newObj = {
        ...state,
        [cat]: {
          ...state[cat],
          All: false,
          [param]: !state[cat][param],
        },
      };
      */
      const newObj = {
        ...state,
        [cat]: {
          ...(state[cat] as BooleanSearchParam),
          All: false,
          [param]: !oldVal,
        },
      };
      switch (cat) {
        case 'nationality':
          if (oldVal) {
            newArray = state.nationalityArr.slice().filter((item) => item !== param);
            newObj.nationalityArr = newArray;
          } else {
            newArray = state.nationalityArr.slice();
            newArray.push(param);
            newObj.nationalityArr = newArray;
          }
          break;
        case 'hullType':
          if (oldVal) {
            newObj.hullTypeArr = state.hullTypeArr.slice().filter((item) => item !== param);
          } else {
            newArray = state.hullTypeArr.slice();
            newArray.push(param);
            newObj.hullTypeArr = newArray;
          }
          break;
        case 'rarity':
          if (oldVal) {
            newObj.rarityArr = state.rarityArr.slice().filter((item) => item !== param);
          } else {
            newArray = state.rarityArr.slice();
            newArray.push(param);
            newObj.rarityArr = newArray;
          }
          break;
        default:
          break;
      }
      return newObj;
    },
    toggleAll(state, action: PayloadAction<string>) {
      const cat = action.payload;
      const oldVal = (state[cat] as BooleanSearchParam).All;
      const newObject = Object.fromEntries(
        Object.entries(state[cat])
          .slice()
          .map(([key]) => [key, false])
      );
      const newState = {
        ...state,
        [cat]: {
          ...newObject,
          All: !oldVal,
        },
      };
      switch (cat) {
        case 'nationality':
          newState.nationalityArr = [];
          break;
        case 'rarity':
          newState.rarityArr = [];
          break;
        case 'hullType':
          newState.hullTypeArr = [];
          break;
        default:
          break;
      }
      return newState;
    },
    setSearchString(state, action: PayloadAction<string>) {
      return { ...state, name: action.payload };
    },
    setFleet(state, action: PayloadAction<{ fleet: 'ALL' | 'VANGUARD' | 'MAIN' }>) {
      return {
        ...state,
        fleet: action.payload.fleet,
      };
    },
    resetParameters() {
      return initialState;
    },
  },
});

export const { resetParameters, toggleParameter, toggleAll, setFleet, setSearchString } = searchParametersSlice.actions;
/**
 * Set the search results.
 * @param {DataStore} shipData Data structure containg full ship data.
 * @param {SearchAction} action Action to perform.
 * @param args Arguments { name: string, cat: string, param: string }
 */
export const updateSearch = (
  shipData: DataStore,
  action: SearchAction,
  args: {
    name: string;
    cat: string;
    param: string;
    list: 'OWNED' | 'ALL';
    id: string;
  }
): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const oldParams = getState().searchParameters;
    const { name, cat, param, list, id } = args;

    switch (action) {
      case 'TOGGLEPARAMETER': {
        let curParamValue = false;
        let curParamList: BooleanSearchParam = {};
        if (isBooleanObj(oldParams[cat])) {
          curParamList = oldParams[cat] as BooleanSearchParam;
          curParamValue = curParamList[param];
        } else {
          dispatch(
            setErrorMessage({
              cState: 'RUNNING',
              eMsg: 'Failed to toggle parameter. Problem with parameter object.',
              eState: 'WARNING',
            })
          );
          return;
        }
        const trueCount = Object.keys(curParamList).reduce<number>(
          (a: number, v: string) => (curParamList[v] ? a + 1 : a),
          0
        );
        // Check if you are toggling the only true paramater back to false
        // -> toggle all parameter to true.
        if (curParamValue && trueCount === 1) {
          dispatch(toggleAll(cat));
          dispatch(toggleSearchState(list));
        } else {
          dispatch(toggleParameter({ cat, param }));
          dispatch(toggleSearchState(list));
        }
        break;
      }
      case 'TOGGLEALL':
        dispatch(toggleAll(cat));
        dispatch(toggleSearchState(list));
        break;
      case 'SETNAME':
        dispatch(setSearchString(name));
        dispatch(toggleSearchState(list));
        break;
      case 'UPDATE':
        dispatch(toggleSearchState(list));
        break;
      case 'REMOVE':
        dispatch(removeShip(id));
        if (list === 'OWNED') {
          dispatch(toggleSearchState(list));
        }
        break;
      default:
        break;
    }

    const { searchParameters, ownedShips, appState } = getState();
    if (appState[list].isSearchChanged) {
      let allShipsSearch: ShipSimple[] = [];
      let ownedSearch: ShipSimple[] = [];
      if (list === 'ALL') {
        allShipsSearch = await shipData.getShipsByParams(searchParameters);
      }
      if (list === 'OWNED') {
        ownedSearch = DataStore.transformStringList(shipData.shipsArr, ownedShips);
        ownedSearch = await DataStore.reduceByParams(shipData, ownedSearch, searchParameters);
      }

      const aLen = allShipsSearch.length;
      const oLen = ownedSearch.length;
      batch(() => {
        if (appState.cToggle === 'ALL' && aLen > 0 && list === 'ALL') {
          const idd = allShipsSearch[0].id;
          const { index } = allShipsSearch[0];
          dispatch(setDetails({ id: idd, index }));
          if (aLen !== 0) {
            dispatch(
              setListState({
                key: 'ALL',
                data: { id: allShipsSearch[0].id, index: allShipsSearch[0].index, isSearchChanged: false },
              })
            );
          } else {
            dispatch(setListState({ key: 'ALL', data: { id: 'NONE', index: NaN, isSearchChanged: false } }));
          }
        } else if (appState.cToggle === 'OWNED' && oLen > 0 && list === 'OWNED') {
          const idd = ownedSearch[0].id;
          const { index } = ownedSearch[0];
          dispatch(setDetails({ id: idd, index }));
          if (oLen !== 0) {
            dispatch(
              setListState({
                key: 'OWNED',
                data: { id: ownedSearch[0].id, index: ownedSearch[0].index, isSearchChanged: false },
              })
            );
          } else {
            dispatch(setListState({ key: 'OWNED', data: { id: 'NONE', index: NaN, isSearchChanged: false } }));
          }
        } else {
          dispatch(resetDetails());
        }
      });
      if (list === 'ALL') {
        dispatch(setSearchList(allShipsSearch));
      }
      if (list === 'OWNED') {
        dispatch(setOwnedSearchList(ownedSearch));
      }
    }
  } catch (e) {
    // if (e instanceof Error) console.log(e.message);
    dispatch(
      setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with performing search update.', eState: 'ERROR' })
    );
  }
};
export default searchParametersSlice.reducer;
