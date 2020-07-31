import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../util/shipdatatypes';

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

export default fullShipListSlice.reducer;
