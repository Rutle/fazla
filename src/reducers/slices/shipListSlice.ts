import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipSimple } from '../../components/util/shipdata';

const initialState: ShipSimple[] = [];

const shipListSlice = createSlice({
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

export const { setList, resetList } = shipListSlice.actions;

export default shipListSlice.reducer;
