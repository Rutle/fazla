import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../utils/shipdatatypes';

const initialState: ShipSimple[] = [];

const shipSearchListSlice = createSlice({
  name: 'shipListSlice',
  initialState,
  reducers: {
    setSearchList(state, action: PayloadAction<ShipSimple[]>) {
      return action.payload;
    },
    resetSearchList() {
      return initialState;
    },
  },
});

export const { setSearchList, resetSearchList } = shipSearchListSlice.actions;

export default shipSearchListSlice.reducer;
