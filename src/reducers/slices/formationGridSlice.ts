import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MiscInformation {
  name: string; // Name displayed on the dropdown list
}

export type Formation = {
  [key: number]: string;
} & MiscInformation;

const initialState: Formation = {
  name: 'Formation',
};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    addShipToFormation(state, action: PayloadAction<{ index: number; id: string }>) {
      console.log({
        ...state,
        [action.payload.index]: action.payload.id,
      });
      return {
        ...state,
        [action.payload.index]: action.payload.id,
      };
    },
    setFormation(state, action: PayloadAction<Formation>) {
      return initialState;
    },
    resetFormation() {
      return initialState;
    },
  },
});

export const { addShipToFormation, setFormation, resetFormation } = formationGridSlice.actions;

export default formationGridSlice.reducer;
