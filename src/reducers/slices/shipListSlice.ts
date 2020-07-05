import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShipData } from '../../components/util/shipdata';

const initialState: ShipData = {
  ships: [],
};

const shipListSlice = createSlice({
  name: 'shipListSlice',
  initialState,
  reducers: {
    setList(state, action: PayloadAction<ShipData>) {
      // console.log("payload", action.payload);
      state.ships = action.payload.ships;
      // console.log("state", state.ships);
    },
    resetList(state, action) {
      return initialState;
    },
    /*
    displayRepo(state, action: PayloadAction<CurrentRepo>) {
      const { org, repo } = action.payload
      state.org = org
      state.repo = repo
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setCurrentDisplayType(state, action: PayloadAction<CurrentDisplayPayload>) {
      const { displayType, issueId = null } = action.payload
      state.displayType = displayType
      state.issueId = issueId
    }
    */
  },
});

export const { setList, resetList } = shipListSlice.actions;

export default shipListSlice.reducer;
