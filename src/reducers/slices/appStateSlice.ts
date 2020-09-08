import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDetails, resetDetails } from './shipDetailsSlice';
import { AppThunk, AppDispatch } from '../../store';
import { setSearchList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import DataStore from '../../util/dataStore';
import { ShipSimple } from '../../util/shipdatatypes';
import { batch } from 'react-redux';
import { saveShipData } from '../../util/appUtilities';
import { setOwnedList } from './ownedShipListSlice';
import { Formation, setFormationsData } from './formationGridSlice';
import { AppConfig, setConfig } from './programConfigSlice';

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';

interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING' | 'SAVING' | 'DOWNLOADING';
  cMsg:
    | 'Initializing.'
    | 'Running.'
    | 'Please wait while updating data.'
    | 'Please wait while downloading data.'
    | 'Please wait while saving data.';
}

interface ListState {
  id: string;
  index: number;
}

interface CurrentPage {
  cPage: 'HOME' | 'LIST' | 'FORMATION';
}

type ListStateObject = {
  [key: string]: any;
  cToggle: string;
  all: ListState;
  owned: ListState;
} & CurrentState &
  CurrentPage;

const initialState: ListStateObject = {
  cToggle: 'all',
  all: {
    id: 'NONE',
    index: 0,
  },
  owned: {
    id: 'NONE',
    index: 0,
  },
  cState: 'INIT',
  cMsg: 'Initializing.',
  cPage: 'HOME',
};

const appStateSlice = createSlice({
  name: 'appStateSlice',
  initialState,
  reducers: {
    setListState(state, action: PayloadAction<{ key: string; data: ListState }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.data,
      };
    },
    setListValue(state, action: PayloadAction<{ key: string; value: boolean }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    },
    setCurrentToggle(state, action: PayloadAction<string>) {
      return {
        ...state,
        cToggle: action.payload,
      };
    },
    setCurrentState(state, action: PayloadAction<CurrentState>) {
      const { cState, cMsg } = action.payload;
      return { ...state, cState: cState, cMsg: cMsg };
    },
    resetList() {
      return initialState;
    },
    setCurrentPage(state, action: PayloadAction<CurrentPage>) {
      const { cPage } = action.payload;
      return { ...state, cPage: cPage };
    },
  },
});

export const {
  setListState,
  resetList,
  setCurrentToggle,
  setCurrentState,
  setListValue,
  setCurrentPage,
} = appStateSlice.actions;

/**
 * Initialize all and owned lists with data.
 * @param {string[]} ownedShips Array of strings containing ship IDs.
 * @param {DataStore} data Data structure containg full ship data.
 * @param {AppConfig} config Configuration information
 * @param {Formation[]} formations Formations saved/created by the user.
 */
export const initShipLists = (
  ownedShips: string[],
  data: DataStore,
  config: AppConfig,
  formations: Formation[],
): AppThunk => async (dispatch: AppDispatch) => {
  let fullSimple: ShipSimple[] = [];
  let ownedSearch: ShipSimple[] = [];
  let searchInitId = 'NONE';
  let searchInitIndex = 0;
  let ownedInitId = 'NONE';
  let ownedInitIndex = 0;
  try {
    // console.log('[INIT] {1}: Inside slice setting lists.');
    fullSimple = await DataStore.transformShipList(data.shipsArr);
    if (ownedSearch !== undefined) {
      ownedSearch = await DataStore.transformStringList(data.shipsArr, ownedShips);
    }
    searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
    searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
    ownedInitId = ownedSearch.length > 0 ? ownedSearch[0].id : 'NONE';
    ownedInitIndex = ownedSearch.length > 0 ? ownedSearch[0].index : NaN;
  } catch (e) {
    console.log('[INIT] {1}: Initializing error: ', e);
    dispatch(setCurrentState({ cState: 'ERROR', cMsg: e.message }));
  }
  batch(() => {
    dispatch(setSearchList(fullSimple));
    dispatch(setOwnedSearchList(ownedSearch));
    dispatch(setOwnedList(ownedShips));
    dispatch(setListState({ key: 'all', data: { id: searchInitId, index: searchInitIndex } }));
    dispatch(setListState({ key: 'owned', data: { id: ownedInitId, index: ownedInitIndex } }));
    dispatch(setDetails({ id: searchInitId, index: searchInitIndex }));
  });
  dispatch(setConfig(config));
  dispatch(setFormationsData(formations));
  dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
};

/**
 * Set details of the seleced ship
 * @param {string} key Key 'all' or 'owned.
 * @param {string} id ID of the ship.
 * @param {number} index Index of the ship in the main DataStore array.
 */
export const setSelectedShip = (key: string, id: string, index: number): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setDetails({ id: id, index: index }));
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
  dispatch(setListState({ key: key, data: { id: id, index: index } }));
};

/**
 * Set the search results.
 * @param {DataStore} shipData Data structure containg full ship data.
 */
export const setSearchResults = (shipData: DataStore): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { searchParameters, ownedShips, appState } = { ...getState() };
    const allShipsSearch = await shipData.getShipsByParams(searchParameters);
    let ownedSearch: ShipSimple[] = [];
    ownedSearch = DataStore.transformStringList(shipData.shipsArr, ownedShips);
    ownedSearch = await DataStore.reduceByParams(shipData, ownedSearch, searchParameters);
    const aLen = allShipsSearch.length;
    const oLen = ownedSearch.length;
    batch(() => {
      if (appState.cToggle === 'all' && aLen > 0) {
        const { id, index } = allShipsSearch[0];
        dispatch(setDetails({ id, index }));
      } else if (appState.cToggle === 'owned' && oLen > 0) {
        const { id, index } = ownedSearch[0];
        dispatch(setDetails({ id, index }));
      } else {
        dispatch(resetDetails());
      }
      if (aLen !== 0) {
        dispatch(setListState({ key: 'all', data: { id: allShipsSearch[0].id, index: allShipsSearch[0].index } }));
      } else {
        dispatch(setListState({ key: 'all', data: { id: 'NONE', index: NaN } }));
      }
      if (oLen !== 0) {
        dispatch(setListState({ key: 'owned', data: { id: ownedSearch[0].id, index: ownedSearch[0].index } }));
      } else {
        dispatch(setListState({ key: 'owned', data: { id: 'NONE', index: NaN } }));
      }
      dispatch(setSearchList(allShipsSearch));
      dispatch(setOwnedSearchList(ownedSearch));
    });
  } catch (e) {
    console.log('setSearchResults error: ', e);
  }
};

/**
 * Update the ship data by downloading raw data from github.
 */
export const updateShipData = (shipData: DataStore): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Please wait while downloading data.' }));
    fetch(SHIPAPIURL)
      .then((res) => res.json())
      .then(
        async (result) => {
          console.log('Fetched: ', Object.keys(result).length);
          try {
            dispatch(setCurrentState({ cState: 'SAVING', cMsg: 'Please wait while saving data.' }));
            const { isOk } = await saveShipData(result);
            if (isOk) {
              dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait while updating data.' }));
              const dataArr = await [...Object.keys(result).map((key) => result[key])];
              await shipData.setArray(dataArr);
              const fullSimple = await DataStore.transformShipList(shipData.shipsArr);
              const searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
              const searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
              batch(() => {
                dispatch(setSearchList(fullSimple));
                dispatch(setListState({ key: 'all', data: { id: searchInitId, index: searchInitIndex } }));
                dispatch(setDetails({ id: searchInitId, index: searchInitIndex }));
              });
              dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
            }
          } catch (error) {
            console.log(error);
            return error;
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        async (error) => {
          console.log('fetch error: ', error);
          return error;
        },
      );
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
    dispatch(setCurrentState({ cState: 'ERROR', cMsg: e.message }));
  }
};

/**
 * Updates owned ships search list.
 * @param {DataStore} data Data structure containg full ship data.
 */
export const updateOwnedSearchList = (data: DataStore): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { ownedShips, searchParameters } = getState();
    const oLen = ownedShips.length;
    let ownedSearch: ShipSimple[] = [];
    ownedSearch = DataStore.transformStringList(data.shipsArr, ownedShips);
    ownedSearch = await DataStore.reduceByParams(data, ownedSearch, searchParameters);
    batch(() => {
      dispatch(setOwnedSearchList(ownedSearch));
      if (oLen !== 0) {
        dispatch(setListState({ key: 'owned', data: { id: ownedSearch[0].id, index: ownedSearch[0].index } }));
      } else {
        dispatch(setListState({ key: 'owned', data: { id: 'NONE', index: NaN } }));
      }
    });
  } catch (e) {
    console.log('updateOwnedSearchList: ', e);
  }
};
/**
 * Updates all ships search list.
 * @param {DataStore} data Data structure containg full ship data.
 */
export const updateSearchList = (data: DataStore): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { ownedShips, searchParameters } = getState();
    const oLen = ownedShips.length;
    let ownedSearch: ShipSimple[] = [];
    ownedSearch = DataStore.transformStringList(data.shipsArr, ownedShips);
    ownedSearch = await DataStore.reduceByParams(data, ownedSearch, searchParameters);
    batch(() => {
      dispatch(setOwnedSearchList(ownedSearch));
      if (oLen !== 0) {
        dispatch(setListState({ key: 'owned', data: { id: ownedSearch[0].id, index: ownedSearch[0].index } }));
      } else {
        dispatch(setListState({ key: 'owned', data: { id: 'NONE', index: NaN } }));
      }
    });
  } catch (e) {
    console.log('updateOwnedSearchList: ', e);
  }
};

export default appStateSlice.reducer;
