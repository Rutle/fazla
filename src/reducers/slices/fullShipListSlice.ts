import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple, Ship } from '../../util/shipdata';
import { AppThunk, AppDispatch } from '../../store';
import { setList } from './shipSearchListSlice';
import { batch } from 'react-redux';
import { setOwnedSearchList } from './ownedSearchListSlice';

const initialState: ShipSimple[] = [];

const fullShipListSlice = createSlice({
  name: 'fullShipListSlice',
  initialState,
  reducers: {
    setFullList(state, action: PayloadAction<ShipSimple[]>) {
      return action.payload;
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setFullList, resetList } = fullShipListSlice.actions;

export const initializeShipLists = (allShips: ShipSimple[], ownedShips: ShipSimple[]): AppThunk => async (
  dispatch: AppDispatch,
) => {
  try {
    console.log('[Init] Initializing ship list in slice: ');
    batch(() => {
      dispatch(setFullList(allShips));
      dispatch(setList(allShips));
      dispatch(setOwnedSearchList(ownedShips));
    });
  } catch (e) {
    console.log('[Init] Initializing error: ', e);
  }
};

export default fullShipListSlice.reducer;
