import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastMessage = {
  type: 'warning' | 'error' | 'info';
  label: string;
  msg: string;
  id: number;
  isCallback: boolean;
};

const initialState: ToastMessage[] = [];

const toastSlice = createSlice({
  name: 'toastSlice',
  initialState,
  reducers: {
    newToast(state, action: PayloadAction<ToastMessage>) {
      return [...state, action.payload];
    },
    removeToastByIndex(state, action: PayloadAction<number>) {
      const index = action.payload;
      return state.filter((item, idx) => idx !== index);
    },
    removeToastById(state, action: PayloadAction<number>) {
      const id = action.payload;
      const newState = state.filter((toast) => toast.id !== id);
      return newState;
    },
    popToast(state) {
      return state.slice(1);
    },
  },
});

export const { newToast, popToast, removeToastById, removeToastByIndex } = toastSlice.actions;

export default toastSlice.reducer;
