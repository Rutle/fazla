import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdata';
import { AppThunk, AppDispatch } from '../../store';
import { setList } from './shipListSlice';
import { batch } from 'react-redux';

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

export const initializeFullShipList = (ships: ShipSimple[]): AppThunk => async (dispatch: AppDispatch) => {
  try {
    batch(() => {
      dispatch(setFullList(ships));
      dispatch(setList(ships));
    });
  } catch (e) {
    console.log(e);
  }
};

export default fullShipListSlice.reducer;
