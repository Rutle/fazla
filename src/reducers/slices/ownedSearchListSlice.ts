import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../components/util/shipdata';

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
