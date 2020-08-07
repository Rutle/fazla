import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimpleShipJson } from '../../util/dataStore';
import { ShipSimple } from '../../util/shipdatatypes';

// const initialState: SimpleShipJson = {};
const initialState: ShipSimple[] = [];

const ownedSearchListSlice = createSlice({
  name: 'ownedSearchListSlice',
  initialState,
  reducers: {
    setOwnedSearchList(state, action: PayloadAction<ShipSimple[]>) {
      return action.payload;
    },
  },
});

export const { setOwnedSearchList } = ownedSearchListSlice.actions;

export default ownedSearchListSlice.reducer;
