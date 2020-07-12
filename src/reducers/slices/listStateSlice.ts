import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListState {
  id: string;
  index: number;
}
/*
interface ListStateObject {
  currentToggle: string;
  all: ListState;
  owned: ListState;
}
*/
interface ListStateObject {
  [key: string]: any;
  all: ListState;
  owned: ListState;
}
const initialState: ListStateObject = {
  currentToggle: 'all',
  all: {
    id: '',
    index: 0,
  },
  owned: {
    id: '',
    index: 0,
  },
};

const listStateSlice = createSlice({
  name: 'listStateSlice',
  initialState,
  reducers: {
    setListState(state, action: PayloadAction<{ key: string; data: ListState }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.data,
      };
    },
    setCurrentToggle(state, action: PayloadAction<string>) {
      return {
        ...state,
        currentToggle: action.payload,
      };
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setListState, resetList, setCurrentToggle } = listStateSlice.actions;

export default listStateSlice.reducer;
