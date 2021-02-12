import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '_/types/types';

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
