import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { id: string; index: number } = {
  id: '',
  index: NaN,
};

const shipDetailsSlice = createSlice({
  name: 'shipDetailsSlice',
  initialState,
  reducers: {
    setDetails(state, action: PayloadAction<{ id: string; index: number }>) {
      return { ...state, id: action.payload.id, index: action.payload.index };
    },
    resetDetails() {
      return initialState;
    },
  },
});

export const { setDetails, resetDetails } = shipDetailsSlice.actions;

export default shipDetailsSlice.reducer;
