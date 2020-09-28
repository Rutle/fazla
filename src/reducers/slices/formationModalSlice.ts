import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../../store';
import { batch } from 'react-redux';
import { SearchAction, setFleet, updateSearch } from './searchParametersSlice';
import DataStore from '../../util/dataStore';
import { setErrorMessage, toggleSearchState } from './appStateSlice';

export enum FormationModalAction {
  Open = 'OPEN',
  Close = 'CLOSE',
}

const initialState: { isOpen: boolean; id: string; shipIndex: number; list: string; gridIndex: number } = {
  isOpen: false,
  id: '',
  shipIndex: NaN,
  list: '',
  gridIndex: NaN,
};

const formationModalSlice = createSlice({
  name: 'formationModalSlice',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ isOpen: boolean; gridIndex: number }>) {
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
  isOpen?: boolean,
  gridIndex?: number,
  shipData?: DataStore,
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    switch (action) {
      case 'OPEN':
        if (isOpen !== undefined && gridIndex !== undefined && shipData && list) {
          const fleet = gridIndex !== undefined && gridIndex <= 2 ? 'MAIN' : 'VANGUARD';
          batch(() => {
            dispatch(setFleet({ fleet: fleet }));
            dispatch(toggleSearchState(list));
            dispatch(updateSearch(shipData, SearchAction.UpdateList, { list: list }));
          });
          dispatch(openModal({ isOpen: isOpen, gridIndex: gridIndex }));
        }
        break;
      case 'CLOSE':
        if (list) {
          batch(() => {
            dispatch(setFleet({ fleet: 'ALL' }));
            dispatch(toggleSearchState(list));
          });
          dispatch(closeModal());
        }
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: e.message }));
  }
};
export default formationModalSlice.reducer;
