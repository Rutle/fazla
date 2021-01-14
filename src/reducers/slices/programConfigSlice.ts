import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_/reducers/store';
import { saveConfig } from '../../utils/appUtilities';
import { AppConfig } from '../../utils/types';
import { setErrorMessage } from './appStateSlice';

export enum AppConfigAction {
  Save = 'SAVE',
  Update = 'UPDATE',
}

const initialState: AppConfig = {
  jsonURL: '',
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
    resetState(state, action) {
      return initialState;
    },
  },
});

export const { setStateValue, setUpdateDate, resetState, setConfig, setEditState } = programConfigSlice.actions;

/**
 * Thunk to handle different config actions.
 * @param {AppConfigAction} action Enum of different actions.
 * @param {string} key Key in slice.
 * @param {string | boolean} value Value of key in slice.
 */
export const configAction = (action: AppConfigAction, key?: string, value?: string | boolean): AppThunk => async (
  dispatch: AppDispatch,
  getState,
) => {
  try {
    const { config } = getState();
    switch (action) {
      case 'UPDATE':
        dispatch(setStateValue({ key: key as string, value: value as string | boolean }));
        break;
      case 'SAVE':
        const { isEdit, ...newConfig } = config;
        await saveConfig(newConfig).then((result) => {
          if (result.isOk) {
            dispatch(setEditState(false));
          }
        });
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with a config action.', eState: 'ERROR' }));
  }
};

export default programConfigSlice.reducer;
