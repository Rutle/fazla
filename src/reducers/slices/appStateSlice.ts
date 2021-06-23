import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk } from '_/reducers/store';
import { batch } from 'react-redux';
import { checkResource, initData } from '_/utils/ipcAPI';
import { compareVersion, downloadShipData, elapsedSinceUpdate } from '_/utils/appUtilities';
import { CallbackDismiss, ToastMessageType } from '_/hooks/useToast';
import DataStore from '_/utils/dataStore';
import {
  AppConfig,
  CurrentState,
  emptyVersionInfo,
  Formation,
  ResponseWithData,
  ShipSimple,
  VersionInfo,
} from '_/types/types';
import { Ship } from '_/types/shipTypes';
import { Equipment } from '_/types/equipmentTypes';
import { setSearchList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { setOwnedList } from './ownedShipListSlice';
import { setFormationsData } from './formationGridSlice';
import { setConfig, setUpdateDate } from './programConfigSlice';

// const SHIPDATAURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';
// const SHIPAPIURL =
//  'http://slowwly.robertomurray.co.uk/delay/10000/url/https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';

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
  versions: VersionInfo;
  isData: boolean;
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
  versions: emptyVersionInfo(),
  isData: false,
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
    setVersionData(state, action: PayloadAction<VersionInfo>) {
      const versionData = action.payload;
      return {
        ...state,
        versions: {
          ...state.versions,
          ...versionData,
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
  setVersionData,
} = appStateSlice.actions;

/**
 * Initialize all and owned lists with data.
 * @param {string[]} ownedShips Array of strings containing ship IDs.
 * @param {DataStore} data Data structure containing full ship data.
 * @param {AppConfig} config Configuration information
 * @param {Formation[]} formations Formations saved/created by the user.
 */
export const initShipLists =
  (ownedShips: string[], data: DataStore, config: AppConfig, formations: Formation[]): AppThunk =>
  (dispatch: AppDispatch, getState) => {
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
      dispatch(setListValue({ key: 'isData', value: true }));
      dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Unable to initialize ship lists.', eState: 'ERROR' }));
    }
  };

export const initShipData =
  (
    data: DataStore,
    platform: string,
    storage?: LocalForage
    // eslint-disable-next-line @typescript-eslint/require-await
  ): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    const { cState } = getState().appState;
    try {
      let res: ResponseWithData = { isOk: false, msg: '', code: '' };
      if (cState === 'INIT' && platform === 'electron') {
        // Check if .json data exists on disk
        // and download if necessary.
        res = await checkResource();
        if (res.code === 'ResNotFound') {
          dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
          res = await downloadShipData(platform);
          if (!res.isOk) throw new Error(res.msg);
          dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
        }
      }
      if (cState === 'INIT' && platform === 'web') {
        if (!storage) {
          throw new Error('Storage was not found.');
        }
        // Check if data and update date exists in IndexedDB (LocalForage)
        // and download if necessary.
        // If it has been 7 days since last update check, check if there is new data.
        const updateDateCheck = (await storage.getItem('timeOfUpdateCheck')) as number;
        const days = elapsedSinceUpdate(updateDateCheck);
        const dataCheck = (await storage.getItem('shipData')) as Ship[];
        const versionInfo = (await storage.getItem('versionInfo')) as VersionInfo;
        const eqCheck = (await storage.getItem('eqData')) as Equipment[];
        if (dataCheck === null || versionInfo === null || updateDateCheck === null || eqCheck === null) {
          // Some data missing. Also no update date has been set.
          dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
          res = await downloadShipData(platform, storage);
          if (!res.isOk) throw new Error(res.msg);
          dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
        } else if (days >= 7) {
          // 7 more days since update check. Compare version numbers and update if necessary.
          const result = await compareVersion(versionInfo);
          await storage.setItem('timeOfUpdateCheck', Date.now());
          if (!result.isOk) throw new Error(result.msg);
          if (result.isUpdReq) {
            dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
            res = await downloadShipData(platform, storage);
            if (!res.isOk) throw new Error(res.msg);
            dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
          }
        }
      }
      const dataObj = await initData(platform, storage);
      if (dataObj.code === 'ResNotFound') throw new Error('Was not able to retrieve ship data.');
      if (dataObj.code === 'JSONParseFail' && platform === 'electron')
        throw new Error("JSON data form didn't match. Delete ships.json and restart app.");
      if (dataObj.code === 'InitError') throw new Error("Couldn't initialize application.");
      await data.setShips(dataObj.shipData);
      await data.setEqs(dataObj.eqData);
      dispatch(setVersionData(dataObj.versionData));
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
export const setSelectedShip =
  (key: 'ALL' | 'OWNED', id: string, index: number): AppThunk =>
  async (
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
export const updateShipData =
  (
    shipData: DataStore,
    // storage?: LocalForage,
    addToast?: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void
  ): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Please wait while downloading data.' }));
    const { config } = getState();
    const platform = process.env.PLAT_ENV;
    try {
      const res = await downloadShipData(platform);
      if (res.isOk && res.data) {
        dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait while updating app state.' }));
        const dataArr = res.data.shipData as Ship[];
        const versInfo = res.data.versionInfo as VersionInfo;
        const updateDate = res.updateDate as string;
        await shipData.setShips(dataArr);
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
          dispatch(setVersionData(versInfo));
        });
      } else {
        throw new Error('There was a problem updating ship data.');
      }
      dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
      if (config.isToast && addToast) addToast('success', 'Update', 'Update finished succesfully.');
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: 'Failed to update ship data.', eState: 'WARNING' }));
      if (config.isToast && addToast) addToast('warning', 'Update', 'Failed to update ship data.');
    }
  };

export default appStateSlice.reducer;
