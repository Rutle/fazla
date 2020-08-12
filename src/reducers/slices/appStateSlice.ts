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

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';

interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING' | 'SAVING';
  cMsg:
    | 'Initializing.'
    | 'Running.'
    | 'Please wait. Downloading and updating in progress.'
    | 'Please wait. Updating saved data.';
}

interface ListState {
  id: string;
  index: number;
}

interface CurrentPage {
  cPage: 'HOME' | 'LIST' | 'FORMATION';
}

export interface AppConfig {
  jsonURL: string;
  themeColor: string;
}

type ListStateObject = {
  [key: string]: any;
  cToggle: string;
  all: ListState;
  owned: ListState;
  ownedIsReady: boolean;
  allIsReady: boolean;
} & CurrentState &
  CurrentPage &
  AppConfig;

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
  ownedIsReady: false,
  allIsReady: false,
  jsonURL: '',
  themeColor: '',
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
    setAppConfigValue(state, action: PayloadAction<AppConfig>) {
      return {
        ...state,
        ...action.payload,
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
  setAppConfigValue,
} = appStateSlice.actions;

/**
 * Initialize all and owned lists with data.
 * @param {string[]} ownedShips Array of strings containing ship IDs.
 * @param {DataStore} data Data structure containg full ship data.
 */
export const initShipLists = (ownedShips: string[], data: DataStore, config: AppConfig): AppThunk => async (dispatch: AppDispatch) => {
  let fullSimple: ShipSimple[] = [];
  let ownedSearch: ShipSimple[] = [];
  let searchInitId = 'NONE';
  let searchInitIndex = 0;
  let ownedInitId = 'NONE';
  let ownedInitIndex = 0;
  try {
    console.log('[INIT] {1}: Inside slice setting lists.');
    fullSimple = await DataStore.transformShipList(data.shipsArr);
    if (ownedSearch !== undefined) {
      ownedSearch = await DataStore.transformStringList(data.shipsArr, ownedShips);
    }
    searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
    searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
    ownedInitId = ownedSearch.length > 0 ? fullSimple[0].id : 'NONE';
    ownedInitIndex = ownedSearch.length > 0 ? fullSimple[0].index : NaN;
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
  dispatch(setAppConfigValue(config));
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
export const updateShipData = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait. Downloading and updating in progress.' }));
    fetch(SHIPAPIURL)
      .then((res) => res.json())
      .then(
        async (result) => {
          console.log('Fetched: ', Object.keys(result).length);
          try {
            const { isOk, msg } = await saveShipData(result);
            console.log(isOk, 'after saveShipData', isOk);
          } catch (error) {
            console.log(error);
          }
          // return { result, isOk, msg };
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
    console.log(ownedSearch);
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
