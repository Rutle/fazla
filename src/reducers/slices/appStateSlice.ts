import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDetails } from './shipDetailsSlice';
import { AppThunk, AppDispatch } from '../../store';
import { setSearchList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import DataStore from '../../util/dataStore';
import { ShipSimple, Formation, AppConfig } from '../../util/types';
import { batch } from 'react-redux';
import { fetchWithTimeout, handleHTTPError, saveShipData } from '../../util/appUtilities';
import { setOwnedList } from './ownedShipListSlice';
import { setFormationsData } from './formationGridSlice';
import { setConfig, setUpdateDate } from './programConfigSlice';

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
//const SHIPAPIURL =
//  'http://slowwly.robertomurray.co.uk/delay/10000/url/https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING' | 'SAVING' | 'DOWNLOADING';
  cMsg: string;
}

interface ErrorState {
  eFlag: boolean;
  eMsg: string;
}
interface InitializingPhases {
  [key: string]: { text: string; isReady: boolean };
}

interface ListState {
  id: string;
  index: number;
  isSearchChanged: boolean;
}

type ListStateObject = {
  [key: string]: unknown;
  cToggle: 'ALL' | 'OWNED';
  ALL: ListState;
  OWNED: ListState;
  shipCount: number;
  initPhases: InitializingPhases;
} & CurrentState &
  ErrorState;

const initialState: ListStateObject = {
  cToggle: 'ALL',
  ALL: {
    id: 'NONE',
    index: 0,
    isSearchChanged: false,
  },
  OWNED: {
    id: 'NONE',
    index: 0,
    isSearchChanged: false,
  },
  cState: 'INIT',
  cMsg: 'Initializing.',
  eMsg: '',
  eFlag: false,
  shipCount: 0,
  isSearchChanged: false,
  initPhases: {
    initData: { text: 'Loading data from disk...', isReady: false },
    initStructure: { text: 'Initializing data structure...', isReady: false },
    initLists: { text: 'Initializing lists...', isReady: false },
  },
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
    setCurrentToggle(state, action: PayloadAction<'ALL' | 'OWNED'>) {
      return {
        ...state,
        cToggle: action.payload,
      };
    },
    setCurrentState(state, action: PayloadAction<CurrentState>) {
      const { cState, cMsg } = action.payload;
      return { ...state, cState: cState, cMsg: cMsg };
    },
    setErrorMessage(state, action: PayloadAction<{ cState: 'RUNNING' | 'ERROR'; eMsg: string }>) {
      const { cState, eMsg } = action.payload;
      return { ...state, cState: cState, eMsg: eMsg, eFlag: true };
    },
    resetList() {
      return initialState;
    },
    setShipCount(state, action: PayloadAction<number>) {
      return { ...state, shipCount: action.payload };
    },
    toggleSearchState(state, action: PayloadAction<'ALL' | 'OWNED'>) {
      const key = action.payload;
      const currentValue = state[key].isSearchChanged;
      return {
        ...state,
        [key]: {
          ...state[key],
          isSearchChanged: !currentValue,
        },
      };
    },
    setPhaseState(state, action: PayloadAction<{ key: string; value: boolean }>) {
      const { key, value } = action.payload;
      return {
        ...state,
        initPhases: {
          ...state['initPhases'],
          [key]: {
            ...state['initPhases'][key],
            isReady: value,
          },
        },
      };
    },
  },
});

export const {
  setListState,
  resetList,
  setCurrentToggle,
  setCurrentState,
  setListValue,
  setShipCount,
  toggleSearchState,
  setPhaseState,
  setErrorMessage,
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
    fullSimple = await DataStore.transformShipList(data.shipsArr);
    if (ownedSearch !== undefined) {
      ownedSearch = await DataStore.transformStringList(data.shipsArr, ownedShips);
    }
    searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
    searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
    ownedInitId = ownedSearch.length > 0 ? ownedSearch[0].id : 'NONE';
    ownedInitIndex = ownedSearch.length > 0 ? ownedSearch[0].index : NaN;
  } catch (e) {
    dispatch(setCurrentState({ cState: 'ERROR', cMsg: e.message }));
  }
  batch(() => {
    dispatch(setSearchList(fullSimple));
    dispatch(setOwnedSearchList(ownedSearch));
    dispatch(setOwnedList(ownedShips));
    dispatch(setListState({ key: 'ALL', data: { id: searchInitId, index: searchInitIndex, isSearchChanged: false } }));
    dispatch(setListState({ key: 'OWNED', data: { id: ownedInitId, index: ownedInitIndex, isSearchChanged: false } }));
    dispatch(setDetails({ id: searchInitId, index: searchInitIndex }));
  });
  dispatch(setPhaseState({ key: 'initLists', value: true }));
  dispatch(setConfig(config));
  dispatch(setFormationsData(formations));
  dispatch(setShipCount(fullSimple.length));
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
  dispatch(setListState({ key: key, data: { id: id, index: index, isSearchChanged: false } }));
};

/**
 * Update the ship data by downloading raw data from github.
 */
export const updateShipData = (shipData: DataStore): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Please wait while downloading data.' }));
  try {
    fetchWithTimeout(SHIPAPIURL, 20000)
      .then(handleHTTPError)
      .then((res) => res.json())
      .then(async (result) => {
        try {
          dispatch(setCurrentState({ cState: 'SAVING', cMsg: 'Please wait while saving data.' }));
          const { isOk, updateDate } = await saveShipData(result);
          if (isOk) {
            dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait while updating app state.' }));
            const dataArr = [...Object.keys(result).map((key) => result[key])];
            await shipData.setArray(dataArr);
            const fullSimple = DataStore.transformShipList(shipData.shipsArr);
            const searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
            const searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
            batch(() => {
              dispatch(setSearchList(fullSimple));
              dispatch(
                setListState({
                  key: 'ALL',
                  data: { id: searchInitId, index: searchInitIndex, isSearchChanged: true },
                }),
              );
              dispatch(setDetails({ id: searchInitId, index: searchInitIndex }));
              dispatch(setShipCount(shipData.count));
              dispatch(setUpdateDate(updateDate));
            });
          }
          dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
        } catch (error) {
          throw new Error('Something went wrong with ship data update.');
        }
      })
      .catch((error) => {
        if ((error.name = 'AbortError')) {
          dispatch(
            setErrorMessage({ cState: 'RUNNING', eMsg: 'Network connection problem or response took too long.' }),
          );
        } else {
          dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: error.message }));
        }
      });
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: 'Failed to update ship data.' }));
  }
};

export default appStateSlice.reducer;
