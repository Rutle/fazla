import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple, Ship } from '../../util/shipdatatypes';

const initialState: { [key: string]: Ship } = {};

const fullShipListSlice = createSlice({
  name: 'fullShipListSlice',
  initialState,
  reducers: {
    setFullList(state, action: PayloadAction<{ [key: string]: Ship }>) {
      return action.payload;
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setFullList, resetList } = fullShipListSlice.actions;

export default fullShipListSlice.reducer;
