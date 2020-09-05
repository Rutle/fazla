import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../../store';
import { batch } from 'react-redux';
import { setFleet } from './searchParametersSlice';

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
    closeModal(state, action: PayloadAction) {
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
  isOpen?: boolean,
  gridIndex?: number,
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    switch (action) {
      case 'OPEN':
        if (isOpen !== undefined && gridIndex !== undefined) {
          const fleet = gridIndex !== undefined && gridIndex >= 2 ? 'MAIN' : 'VANGUARD';
          batch(() => {
            dispatch(setFleet({ fleet: fleet }));
            dispatch(openModal({ isOpen: isOpen, gridIndex: gridIndex }));
          });
        }
        break;
      case 'CLOSE':
        batch(() => {
          dispatch(setFleet({ fleet: 'ALL' }));
          dispatch(closeModal());
        });
        break;
      default:
        break;
    }
  } catch (e) {
    console.log('updateOwnedSearchList: ', e);
  }
};
export default formationModalSlice.reducer;
