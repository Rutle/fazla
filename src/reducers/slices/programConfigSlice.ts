import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_/reducers/store';
import { saveConfig } from '_/utils/ipcAPI';
import { AppConfig } from '_/types/types';
import { setErrorMessage } from './appStateSlice';

const configApp = localStorage.getItem('config') as string;
let themeColor: 'dark' | 'light' = 'dark';
if (configApp !== null) {
  themeColor = (JSON.parse(configApp) as AppConfig).themeColor;
}

export enum AppConfigAction {
  Save = 'SAVE',
  Update = 'UPDATE',
}

const initialState: AppConfig = {
  jsonURL: 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json',
  themeColor: themeColor === null ? 'dark' : themeColor,
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

/**
 * Thunk to handle different config actions.
 * @param {AppConfigAction} action Enum of different actions.
 * @param {string} platform web or electron
 * @param {string} key Key in slice.
 * @param {string | boolean} value Value of key in slice.
 */
export const configAction = (
  action: AppConfigAction,
  platform: string,
  key?: string,
  value?: string | boolean
): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { config } = getState();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isEdit, ...newConfig } = config;
    switch (action) {
      case 'UPDATE':
        dispatch(setStateValue({ key: key as string, value: value as string | boolean }));
        break;
      case 'SAVE':
        if (platform === 'electron') {
          await saveConfig(newConfig).then((result) => {
            if (result.isOk) {
              dispatch(setEditState(false));
            }
          });
        }
        if (platform === 'web') {
          localStorage.setItem('config', JSON.stringify(newConfig));
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
