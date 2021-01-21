import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_reducers/store';
import { batch } from 'react-redux';
import { resetParameters, SearchAction, setFleet, updateSearch } from './searchParametersSlice';
import DataStore from '../../utils/dataStore';
import { setErrorMessage, setIsUpdated } from './appStateSlice';

export enum FormationModalAction {
  Open = 'OPEN',
  Close = 'CLOSE',
}
const MAININDEX = [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20];
const VANGUARDINDEX = [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23];
const initialState: { id: string; shipIndex: number; list: string; gridIndex: number } = {
  id: '',
  shipIndex: NaN,
  list: '',
  gridIndex: NaN,
};

const formationModalSlice = createSlice({
  name: 'formationModalSlice',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ gridIndex: number }>) {
      return { ...state, ...action.payload };
    },
    closeModal() {
      return initialState;
    },
  },
});

export const { openModal, closeModal } = formationModalSlice.actions;
/**
 * Updates all ships search list.
 * @param {DataStore} data Data structure containg full ship data.
 */
export const formationModalAction = (
  action: FormationModalAction,
  list?: 'ALL' | 'OWNED',
  gridIndex?: number,
  shipData?: DataStore
  // eslint-disable-next-line @typescript-eslint/require-await
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    switch (action) {
      case 'OPEN':
        if (gridIndex !== undefined && shipData && list) {
          let fleet: 'ALL' | 'VANGUARD' | 'MAIN';
          if (MAININDEX.includes(gridIndex)) {
            fleet = 'MAIN';
          } else if (VANGUARDINDEX.includes(gridIndex)) {
            fleet = 'VANGUARD';
          } else {
            throw new Error('Invalid grid index.');
          }
          batch(() => {
            dispatch(resetParameters());
            dispatch(setFleet({ fleet }));
            dispatch(setIsUpdated({ key: list, value: false }));
            dispatch(updateSearch(shipData, SearchAction.UpdateList, { name: '', cat: '', param: '', id: '', list }));
          });
          dispatch(openModal({ gridIndex }));
        }
        break;
      case 'CLOSE':
        if (list && shipData) {
          batch(() => {
            dispatch(setFleet({ fleet: 'ALL' }));
            dispatch(setIsUpdated({ key: list, value: false }));
            dispatch(updateSearch(shipData, SearchAction.UpdateList, { name: '', cat: '', param: '', id: '', list }));
            dispatch(resetParameters());
          });
          dispatch(closeModal());
        }
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(
      setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with formation modal action.', eState: 'ERROR' })
    );
  }
};
export default formationModalSlice.reducer;
