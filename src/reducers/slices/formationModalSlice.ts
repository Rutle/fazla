import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { isOpen: boolean; id: string; shipIndex: number; list: string; gridIndex: number } = {
  isOpen: false,
  id: '',
  shipIndex: NaN,
  list: '',
  gridIndex: NaN,
};

const formationModalSlice = createSlice({
  name: 'formationModalSlice',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ isOpen: boolean; gridIndex: number }>) {
      return { ...state, ...action.payload };
    },
    setId(state, action: PayloadAction<string>) {
      return { ...state, id: action.payload };
    },
    closeModal(state, action: PayloadAction) {
      return initialState;
    },
  },
});

export const { openModal, setId, closeModal } = formationModalSlice.actions;

export default formationModalSlice.reducer;
