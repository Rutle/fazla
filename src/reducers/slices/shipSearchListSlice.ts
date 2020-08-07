import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimpleShipJson } from '../../util/dataStore';
import { ShipSimple } from '../../util/shipdatatypes';

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
