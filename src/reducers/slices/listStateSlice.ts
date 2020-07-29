import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDetails, resetDetails } from './shipDetailsSlice';
import { getShipById, ShipSimple } from '../../util/shipdata';
import { batch } from 'react-redux';
import { AppThunk, AppDispatch } from '../../store';
import { setList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { setFullList } from './fullShipListSlice';
// import { setCurrentState } from './appStateSlice';

interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR';
  cMsg: 'Initializing.' | 'Running.';
}

interface ListState {
  id: string;
  index: number;
}

type ListStateObject = {
  [key: string]: any;
  all: ListState;
  owned: ListState;
} & CurrentState;

const initialState: ListStateObject = {
  cToggle: 'all',
  all: {
    id: 'NONE',
    index: 0,
  },
  owned: {
    id: 'NONE',
    index: 0,
  },
  cState: 'INIT',
  cMsg: 'Initializing.',
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
        cToggle: action.payload,
      };
    },
    setCurrentState(state, action: PayloadAction<CurrentState>) {
      const { cState, cMsg } = action.payload;
      return { ...state, cState: cState, cMsg: cMsg };
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setListState, resetList, setCurrentToggle, setCurrentState } = listStateSlice.actions;

// Initialize ship lists.
export const initShipLists = (allShips: ShipSimple[], ownedShips: ShipSimple[]): AppThunk => async (
  dispatch: AppDispatch,
) => {
  try {
    console.log('[INIT] {1}: Inside slice setting lists.');
    batch(() => {
      dispatch(setFullList(allShips));
      dispatch(setList(allShips));
      dispatch(setOwnedSearchList(ownedShips));
    });
  } catch (e) {
    console.log('[INIT] {1}: Initializing error: ', e);
    dispatch(setCurrentState({ cState: 'ERROR', cMsg: e.message }));
  }
};

// Initialize the list states.
export const initListState = (
  key: string,
  index: number,
  id: string,
  key2: string,
  index2: number,
  id2: string,
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    console.log('[INIT] {2}: Setting list states');
    batch(() => {
      dispatch(setDetails(getShipById(id)));
      dispatch(setListState({ key: key, data: { id: id, index: index } }));
      dispatch(setListState({ key: key2, data: { id: id2, index: index2 } }));
      dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
    });
  } catch (e) {
    console.log('Setting list states error: ', e);
  }
};

// Set details of the selected ship
export const setSelectedShip = (key: string, index: number, id: string): AppThunk => async (dispatch: AppDispatch) => {
  try {
    console.log('Setting selected ship: index [', index, '], id [', id, '] key', key, ']');
    batch(() => {
      dispatch(setDetails(getShipById(id)));
      dispatch(setListState({ key: key, data: { id: id, index: index } }));
    });
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
};

// Set the search results.
export const setSearchResults = (allShips: ShipSimple[], ownedShips: ShipSimple[], cToggle: string): AppThunk => async (
  dispatch: AppDispatch,
) => {
  try {
    console.log('Setting search results!');
    const aLen = allShips.length;
    const oLen = ownedShips.length;
    batch(() => {
      if (cToggle === 'all' && aLen > 0) {
        dispatch(setDetails(getShipById(allShips[0].id)));
      } else if (cToggle === 'owned' && oLen > 0) {
        dispatch(setDetails(getShipById(ownedShips[0].id)));
      } else {
        dispatch(resetDetails());
      }
      if (aLen !== 0) {
        dispatch(setListState({ key: 'all', data: { id: allShips[0].id, index: 0 } }));
      } else {
        dispatch(setListState({ key: 'all', data: { id: 'NONE', index: 0 } }));
      }
      if (oLen !== 0) {
        dispatch(setListState({ key: 'owned', data: { id: ownedShips[0].id, index: 0 } }));
      } else {
        dispatch(setListState({ key: 'owned', data: { id: 'NONE', index: 0 } }));
      }
      // Set empty state in case search is empty. Check for it in ShipList/ShipDetailView/ShipDetails
      // SetList / setOwnedSearchList -> empty list, ListState has to have empty values.
      dispatch(setList(allShips));
      dispatch(setOwnedSearchList(ownedShips));
    });
  } catch (e) {
    console.log('setSearchResults error: ', e);
  }
};
export default listStateSlice.reducer;
