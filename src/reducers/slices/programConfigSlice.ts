import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../../store';
import { saveConfig } from '../../util/appUtilities';

export enum AppConfigAction {
  Save = 'SAVE',
  Update = 'UPDATE',
}
export type AppConfig = {
  jsonURL: string;
  themeColor: 'dark' | 'light';
  firstTime: boolean;
  formHelpTooltip: boolean;
  isEdit?: boolean;
};

const initialState: AppConfig = {
  jsonURL: '',
  themeColor: 'dark',
  firstTime: true,
  formHelpTooltip: true,
};

const programConfigSlice = createSlice({
  name: 'programConfigSlice',
  initialState,
  reducers: {
    setStateValue(state, action: PayloadAction<{ key: string; value: string | boolean }>) {
      console.log({
        ...state,
        [action.payload.key]: action.payload.value,
        isEdit: true,
      });
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        isEdit: true,
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

export const { setStateValue, resetState, setConfig, setEditState } = programConfigSlice.actions;

/**
 * Set details of the seleced ship
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
          console.log(result.isOk);
          if (result.isOk) {
            dispatch(setEditState(false));
          }
        });
        break;

      default:
        break;
    }
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
};

export default programConfigSlice.reducer;
