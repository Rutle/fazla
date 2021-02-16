import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '_/reducers/store';
import { batch } from 'react-redux';
import { checkResource, initData, saveShipData } from '_/utils/ipcAPI';
import { downloadShipData, fetchWithTimeout, handleHTTPError } from '_/utils/appUtilities';
import { CallbackDismiss, ToastMessageType } from '_/components/Toast/useToast';
import DataStore from '_/utils/dataStore';
import { AppConfig, BasicResponse, Formation, Ship, ShipSimple } from '_/types/types';
import { setSearchList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { setOwnedList } from './ownedShipListSlice';
import { setFormationsData } from './formationGridSlice';
import { setConfig, setUpdateDate } from './programConfigSlice';

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
// const SHIPAPIURL =
//  'http://slowwly.robertomurray.co.uk/delay/10000/url/https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING' | 'SAVING' | 'DOWNLOADING';
  cMsg: string;
}

interface ErrorState {
  eState: '' | 'WARNING' | 'ERROR';
  eMsg: string;
}

interface ListState {
  id: string;
  index: number;
  isUpdated: boolean;
}

type ListStateObject = {
  [key: string]: unknown;
  cToggle: 'ALL' | 'OWNED';
  ALL: ListState;
  OWNED: ListState;
  shipCount: number;
} & CurrentState &
  ErrorState;

const initialState: ListStateObject = {
  cToggle: 'ALL',
  ALL: {
    id: 'NONE',
    index: 0,
    isUpdated: false,
  },
  OWNED: {
    id: 'NONE',
    index: 0,
    isUpdated: false,
  },
  cState: 'INIT',
  cMsg: 'Initializing.',
  eMsg: '',
  eState: '',
  shipCount: 0,
  isSearchChanged: false,
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
      return { ...state, cState, cMsg };
    },
    setErrorMessage(
      state,
      action: PayloadAction<{ cState: 'RUNNING' | 'ERROR'; eMsg: string; eState: '' | 'WARNING' | 'ERROR' }>
    ) {
      const { cState, eMsg, eState } = action.payload;
      return {
        ...state,
        cState,
        eMsg,
        eState,
      };
    },
    clearErrorMessage(state) {
      return { ...state, eMsg: '', eState: '' };
    },
    resetList() {
      return initialState;
    },
    setShipCount(state, action: PayloadAction<number>) {
      return { ...state, shipCount: action.payload };
    },
    setIsUpdated(state, action: PayloadAction<{ key: 'ALL' | 'OWNED'; value: boolean }>) {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: {
          ...state[key],
          isUpdated: value,
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
  setIsUpdated,
  setErrorMessage,
  clearErrorMessage,
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
  formations: Formation[]
  // eslint-disable-next-line @typescript-eslint/require-await
): AppThunk => async (dispatch: AppDispatch, getState) => {
  let fullSimple: ShipSimple[] = [];
  let ownedSearch: ShipSimple[] = [];
  let searchInitId = 'NONE';
  let searchInitIndex = 0;
  let ownedInitId = 'NONE';
  let ownedInitIndex = 0;
  const initialConfig = getState().config;
  try {
    fullSimple = DataStore.transformShipList(data.getShips());
    if (ownedSearch !== undefined) {
      ownedSearch = DataStore.transformStringList(data.getShips(), ownedShips);
    }
    searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
    searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
    ownedInitId = ownedSearch.length > 0 ? ownedSearch[0].id : 'NONE';
    ownedInitIndex = ownedSearch.length > 0 ? ownedSearch[0].index : NaN;
    batch(() => {
      dispatch(setSearchList(fullSimple));
      dispatch(setOwnedSearchList(ownedSearch));
      dispatch(setOwnedList(ownedShips));
      dispatch(setListState({ key: 'ALL', data: { id: searchInitId, index: searchInitIndex, isUpdated: true } }));
      dispatch(setListState({ key: 'OWNED', data: { id: ownedInitId, index: ownedInitIndex, isUpdated: true } }));
    });
    if (config !== null) {
      dispatch(setConfig(config));
    } else {
      dispatch(setConfig(initialConfig));
    }
    dispatch(setFormationsData(formations));
    dispatch(setShipCount(fullSimple.length));
    dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Unable to initialize ship lists.', eState: 'ERROR' }));
  }
};

export const initShipData = (
  data: DataStore,
  platform: string,
  storage?: LocalForage
  // eslint-disable-next-line @typescript-eslint/require-await
): AppThunk => async (dispatch: AppDispatch, getState) => {
  const { cState } = getState().appState;
  try {
    let res: BasicResponse = { isOk: false, msg: '', code: '' };
    if (cState === 'INIT' && platform === 'electron') {
      // Check if .json data exists on disk
      // and download if necessary.
      res = await checkResource();
      if (res.isOk && res.code === 'ResNotFound') {
        dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
        res = await downloadShipData(platform);
        dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
      }
    }
    if (cState === 'INIT' && platform === 'web') {
      if (!storage) {
        throw new Error('Storage was not found.');
      }
      // Check if data exists in IndexedDB (LocalForage)
      // and download if necessary.
      const dataCheck = (await storage.getItem('shipData')) as Ship[];
      if (dataCheck === null) {
        dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
        res = await downloadShipData(platform, storage);
        dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
      }
    }
    const dataObj = await initData(platform, storage);
    if (dataObj.code === 'ResNotFound') throw new Error('Was not able to retrieve ship data.');
    if (dataObj.code === 'JSONParseFail') throw new Error("JSON data form didn't match.");
    if (dataObj.code === 'InitError') throw new Error("Couldn't initialize application");
    await data.setArray(dataObj.shipData);
    dispatch(initShipLists(dataObj.ownedShips, data, dataObj.config, dataObj.formations));
  } catch (e) {
    if (e instanceof Error) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: e.message, eState: 'ERROR' }));
    }
  }
};

/**
 * Set details of the seleced ship
 * @param {string} key Key 'all' or 'owned.
 * @param {string} id ID of the ship.
 * @param {number} index Index of the ship in the main DataStore array.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const setSelectedShip = (key: 'ALL' | 'OWNED', id: string, index: number): AppThunk => async (
  dispatch: AppDispatch,
  getState
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const { appState } = getState();
  try {
    dispatch(setListState({ key, data: { id, index, isUpdated: appState[key].isUpdated } }));
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: 'There was a problem selecting a ship', eState: 'WARNING' }));
  }
};

/**
 * Update the ship data by downloading raw data from github.
 */
export const updateShipData = (
  shipData: DataStore,
  storage?: LocalForage,
  addToast?: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void
): AppThunk => async (dispatch: AppDispatch, getState) => {
  dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Please wait while downloading data.' }));
  const { config } = getState();
  const platform = process.env.PLAT_ENV;
  try {
    await fetchWithTimeout(SHIPAPIURL, 20000)
      .then(handleHTTPError)
      .then((res) => res.json())
      .then(async (result: { [key: string]: Ship }) => {
        try {
          dispatch(setCurrentState({ cState: 'SAVING', cMsg: 'Please wait while saving data.' }));
          let isOk = true;
          let updateDate = '';
          const dataArr: Ship[] = [...Object.keys(result).map((key) => result[key])];
          if (platform === 'electron') {
            const response = await saveShipData(result);
            isOk = response.isOk;
            updateDate = response.updateDate as string;
          }
          if (platform === 'web' && storage) {
            const today = new Date();
            updateDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { isEdit, ...newConfig } = { ...config, updateDate };
            await storage.setItem('shipData', dataArr);
            await storage.setItem('config', newConfig);
          }
          if (isOk) {
            dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait while updating app state.' }));
            await shipData.setArray(dataArr);
            const fullSimple = DataStore.transformShipList(dataArr);
            const searchInitId = fullSimple.length > 0 ? fullSimple[0].id : 'NONE';
            const searchInitIndex = fullSimple.length > 0 ? fullSimple[0].index : NaN;
            batch(() => {
              dispatch(setSearchList(fullSimple));
              dispatch(
                setListState({
                  key: 'ALL',
                  data: { id: searchInitId, index: searchInitIndex, isUpdated: false },
                })
              );
              dispatch(setShipCount(dataArr.length));
              dispatch(setUpdateDate(updateDate));
            });
          } else {
            throw new Error('There was a problem saving ship data.');
          }
          dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
          if (config.isToast && addToast) addToast('success', 'Update', 'Update finished succesfully.');
        } catch (error) {
          dispatch(
            setErrorMessage({
              cState: 'RUNNING',
              eMsg: 'There was a problem with saving new ship data.1',
              eState: 'WARNING',
            })
          );
          if (config.isToast && addToast) {
            addToast('warning', 'Update', 'There was a problem with saving new ship data. No changes made.');
          }
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            dispatch(
              setErrorMessage({
                cState: 'RUNNING',
                eMsg: 'Network connection problem or response took too long.',
                eState: 'WARNING',
              })
            );
            if (config.isToast && addToast)
              addToast('warning', 'Update', 'Network connection problem or response took too long.');
          } else {
            dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: error.message, eState: 'WARNING' }));
            if (config.isToast && addToast) addToast('warning', 'Update', error.message);
          }
        }
      });
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: 'Failed to update ship data.', eState: 'WARNING' }));
    if (config.isToast && addToast) addToast('warning', 'Update', 'Failed to update ship data.');
  }
};

export default appStateSlice.reducer;
