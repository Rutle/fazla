import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ship } from '../../components/util/shipdata';

const initialState: Ship = {
  wikiUrl: '',
  id: '',
  names: { en: '', code: '', cn: '', jp: '', kr: '' },
  skills: [],
};

const shipDetailsSlice = createSlice({
  name: 'shipDetailsSlice',
  initialState,
  reducers: {
    setDetails(state, action: PayloadAction<Ship>) {
      return action.payload;
    },
    resetDetails(state, action) {
      return initialState;
    },
  },
});

export const { setDetails, resetDetails } = shipDetailsSlice.actions;

export default shipDetailsSlice.reducer;
