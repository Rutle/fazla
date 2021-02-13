import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_/reducers/store';
import { saveConfig } from '_/utils/ipcAPI';
import { AppConfig, BasicResponse } from '_/types/types';
import { setErrorMessage } from './appStateSlice';
/*
const configApp = localStorage.getItem('config') as string;
let themeColor: 'dark' | 'light' = 'dark';
if (configApp !== null) {
  themeColor = (JSON.parse(configApp) as AppConfig).themeColor;
}
*/
export enum AppConfigAction {
  Save = 'SAVE',
  Update = 'UPDATE',
}

const initialState: AppConfig = {
  jsonURL: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json',
  themeColor: 'dark',
  firstTime: true,
  formHelpTooltip: true,
  isToast: true,
  updateDate: '',
};

const programConfigSlice = createSlice({
  name: 'programConfigSlice',
  initialState,
  reducers: {
    setStateValue(state, action: PayloadAction<{ key: string; value: string | boolean }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        isEdit: true,
      };
    },
    setUpdateDate(state, action: PayloadAction<string>) {
      return {
        ...state,
        updateDate: action.payload,
      };
    },
    setConfig(state, action: PayloadAction<AppConfig>) {
      return {
        ...state,
        ...action.payload,
        isEdit: false,
        firstTime: false,
      };
    },
    setEditState(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isEdit: action.payload,
      };
    },
    resetState() {
      return initialState;
    },
  },
});

export const { setStateValue, setUpdateDate, resetState, setConfig, setEditState } = programConfigSlice.actions;

interface ConfigActionData {
  key?: string;
  value?: string | boolean;
  doSave?: boolean;
  storage?: LocalForage;
}

/**
 * Thunk to handle different config actions.
 * @param {AppConfigAction} action Enum of different actions.
 * @param {ConfigActionData} data Key in slice.
 */
export const configAction = (action: AppConfigAction, data: ConfigActionData): AppThunk => async (
  dispatch: AppDispatch,
  getState
) => {
  let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
  try {
    const platform = process.env.PLAT_ENV;
    const { config } = getState();
    const { storage, key, value, doSave } = data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isEdit, ...newConfig } = { ...config };
    switch (action) {
      case 'UPDATE':
        if (doSave && platform === 'web' && storage) {
          if (key === 'themeColor') {
            console.log(key);
            newConfig.themeColor = value as 'dark' | 'light';
            await storage.setItem('config', newConfig);
          }
        }
        dispatch(setStateValue({ key: key as string, value: value as string | boolean }));

        break;
      case 'SAVE':
        if (platform === 'electron') {
          result = await saveConfig(newConfig);
        }
        if (platform === 'web' && storage) {
          // localStorage.setItem('config', JSON.stringify(newConfig));
          const res = await storage.setItem('config', newConfig);
          // await dispatch(setEditState(false));
          result.isOk = Object.is(res, newConfig);
        }
        if (result.isOk) {
          dispatch(setEditState(false));
        }
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with a config action.', eState: 'ERROR' }));
  }
};

export default programConfigSlice.reducer;
