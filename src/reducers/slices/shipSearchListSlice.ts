import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdatatypes';

const initialState: ShipSimple[] = [];

const shipSearchListSlice = createSlice({
  name: 'shipListSlice',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<ShipSimple[]>) {
      return action.payload;
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setList, resetList } = shipSearchListSlice.actions;

export default shipSearchListSlice.reducer;
