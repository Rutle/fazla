import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { isBooleanObj } from '_/utils/appUtilities';
import { AppThunk, AppDispatch } from '_reducers/store';
import DataStore from '_/utils/dataStore';
import { BooleanSearchParam, SearchParams, ShipSimple } from '_/types/types';
import { setErrorMessage, setListState, setIsUpdated } from './appStateSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { setSearchList } from './shipSearchListSlice';

export enum SearchAction {
  ToggleParameter = 'TOGGLEPARAMETER',
  ToggleAll = 'TOGGLEALL',
  SetSearch = 'SETSEARCH',
  UpdateList = 'UPDATE',
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
  isChanged: false,
};

const searchParametersSlice = createSlice({
  name: 'searchParametersSlice',
  initialState,
  reducers: {
    toggleParameter(state, action: PayloadAction<{ cat: string; param: string }>) {
      const { cat, param } = action.payload;
      const od = state[cat] as BooleanSearchParam;
      const oldVal = od[param];
      let newArray = [];
      const newObj = {
        ...state,
        isChanged: true,
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
        isChanged: true,
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
      return { ...state, name: action.payload, isChanged: true };
    },
    setFleet(state, action: PayloadAction<{ fleet: 'ALL' | 'VANGUARD' | 'MAIN' | 'SUBMARINE' }>) {
      return {
        ...state,
        fleet: action.payload.fleet,
        isChanged: true,
      };
    },
    setChangeState(state, action: PayloadAction<boolean>) {
      return { ...state, isChanged: action.payload };
    },
    resetParameters() {
      return initialState;
    },
    resetToggles(state) {
      return { ...initialState, name: state.name, isChanged: true };
    },
  },
});

export const { resetParameters, toggleParameter, toggleAll, setFleet, setSearchString, setChangeState, resetToggles } =
  searchParametersSlice.actions;
/**
 * Set the search results.
 * @param {DataStore} shipData Data structure containg full ship data.
 * @param {SearchAction} action Action to perform.
 * @param args Arguments { name: string, cat: string, param: string, list: 'OWNED' | 'ALL', id: string }
 */
export const updateSearch =
  (
    shipData: DataStore,
    action: SearchAction,
    args: {
      list: 'OWNED' | 'ALL';
      searchString?: string;
      cat?: string;
      param?: string;
      id?: string;
    } = { list: 'ALL', searchString: '', cat: '', param: '', id: '' }
  ): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    try {
      const oldParams = getState().searchParameters;
      const { searchString, cat, param, list } = args;
      switch (action) {
        case 'TOGGLEPARAMETER': {
          let curParamValue = false;
          let curParamList: BooleanSearchParam = {};
          if (isBooleanObj(oldParams[cat as string])) {
            curParamList = oldParams[cat as string] as BooleanSearchParam;
            curParamValue = curParamList[param as string];
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
          // result -> toggle all parameter to true.
          if (curParamValue && trueCount === 1) {
            dispatch(toggleAll(cat as string));
          } else {
            dispatch(toggleParameter({ cat: cat as string, param: param as string }));
          }
          break;
        }
        case 'TOGGLEALL':
          dispatch(toggleAll(cat as string));
          break;
        case 'SETSEARCH':
          dispatch(setSearchString(searchString as string));
          break;
        default:
          break;
      }

      const { searchParameters, ownedShips, appState } = getState();
      const oldListState = appState[list];
      if (searchParameters.isChanged || !appState[list].isUpdated) {
        let allShipsSearch: ShipSimple[] = [];
        let ownedSearch: ShipSimple[] = [];
        if (list === 'ALL') {
          allShipsSearch = await shipData.getShipsByParams(searchParameters);
        }
        if (list === 'OWNED') {
          ownedSearch = DataStore.transformStringList(shipData.getShips(), ownedShips);
          ownedSearch = await DataStore.reduceByParams(shipData, ownedSearch, searchParameters);
        }

        const aLen = allShipsSearch.length;
        const oLen = ownedSearch.length;
        batch(() => {
          if (appState.cToggle === 'ALL' && list === 'ALL') {
            // Check if currently selected ship is still in the results and keep it selected.
            const newShip = allShipsSearch.find((ship) => ship.id === oldListState.id) || allShipsSearch[0];
            if (aLen !== 0) {
              dispatch(
                setListState({
                  key: 'ALL',
                  data: { id: newShip.id, index: newShip.index, isUpdated: true },
                })
              );
            } else {
              dispatch(setListState({ key: 'ALL', data: { id: 'NONE', index: NaN, isUpdated: true } }));
            }
          } else if (appState.cToggle === 'OWNED' && list === 'OWNED') {
            // Check if currently selected ship is still in the results and keep it selected.
            const newShip = ownedSearch.find((ship) => ship.id === oldListState.id) || ownedSearch[0];
            if (oLen !== 0) {
              dispatch(
                setListState({
                  key: 'OWNED',
                  data: { id: newShip.id, index: newShip.index, isUpdated: true },
                })
              );
            } else {
              dispatch(setListState({ key: 'OWNED', data: { id: 'NONE', index: NaN, isUpdated: true } }));
            }
          }
          if (action !== 'UPDATE') {
            if (list === 'ALL') {
              dispatch(setIsUpdated({ key: 'OWNED', value: false }));
            } else {
              dispatch(setIsUpdated({ key: 'ALL', value: false }));
            }
          }
          if (list === 'ALL') {
            dispatch(setSearchList(allShipsSearch));
          }
          if (list === 'OWNED') {
            dispatch(setOwnedSearchList(ownedSearch));
          }
        });
        dispatch(setChangeState(false));
      }
    } catch (e) {
      // if (e instanceof Error) console.log(e.message);
      dispatch(
        setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with performing search update.', eState: 'ERROR' })
      );
    }
  };
export default searchParametersSlice.reducer;
