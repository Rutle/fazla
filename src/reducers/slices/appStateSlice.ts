import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDetails, resetDetails } from './shipDetailsSlice';
import { getShipById, getShipData } from '../../util/appUtilities';
import { batch } from 'react-redux';
import { AppThunk, AppDispatch } from '../../store';
import { setList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';
import { setFullList } from './fullShipListSlice';
import { ShipSimple } from '../../util/shipdatatypes';

const SHIPAPIURL = 'https://raw.githubusercontent.com/AzurAPI/azurapi-js-setup/master/ships.json';

interface CurrentState {
  cState: 'INIT' | 'RUNNING' | 'ERROR' | 'UPDATING';
  cMsg: 'Initializing.' | 'Running.' | 'Please wait. Downloading and updating in progress.';
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
  useTempData: true,
};

const appStateSlice = createSlice({
  name: 'appStateSlice',
  initialState,
  reducers: {
    setListState(state, action: PayloadAction<{ key: string; data: ListState }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.data,
      };
    },
    setListValue(state, action: PayloadAction<{ key: string; value: boolean }>) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
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

export const { setListState, resetList, setCurrentToggle, setCurrentState, setListValue } = appStateSlice.actions;

// Initialize ship lists.
export const initShipLists = (): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    console.log('[INIT] {1}: Inside slice setting lists.');
    const { data, isTempData } = await getShipData();
    const ownedShips = getState().ownedShips.slice();
    batch(() => {
      dispatch(setListValue({ key: 'useTempData', value: !isTempData }));
      dispatch(setFullList(data));
      dispatch(setList(data));
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
  useTempData: boolean,
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    console.log('[INIT] {2}: Setting list states');
    batch(() => {
      dispatch(setDetails(getShipById(id, useTempData)));
      dispatch(setListState({ key: key, data: { id: id, index: index } }));
      dispatch(setListState({ key: key2, data: { id: id2, index: index2 } }));
      dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
    });
  } catch (e) {
    console.log('Setting list states error: ', e);
  }
};

// Set details of the selected ship
export const setSelectedShip = (key: string, index: number, id: string, useTempData: boolean): AppThunk => async (
  dispatch: AppDispatch,
) => {
  try {
    // console.log('Setting selected ship: index [', index, '], id [', id, '] key', key, ']');
    batch(() => {
      dispatch(setDetails(getShipById(id, useTempData)));
      dispatch(setListState({ key: key, data: { id: id, index: index } }));
    });
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
};

// Set the search results.
export const setSearchResults = (
  allShips: ShipSimple[],
  ownedShips: ShipSimple[],
  cToggle: string,
  useTempData: boolean,
): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const searchParameters = { ...getState() };
    console.log('Setting search results! ', searchParameters);
    const aLen = allShips.length;
    const oLen = ownedShips.length;
    batch(() => {
      if (cToggle === 'all' && aLen > 0) {
        dispatch(setDetails(getShipById(allShips[0].id, useTempData)));
      } else if (cToggle === 'owned' && oLen > 0) {
        dispatch(setDetails(getShipById(ownedShips[0].id, useTempData)));
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

// Set details of the selected ship
export const updateShipData = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(setCurrentState({ cState: 'UPDATING', cMsg: 'Please wait. Downloading and updating in progress.' }));
    fetch(SHIPAPIURL)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Fetched: ', Object.keys(result).length);
          dispatch(setCurrentState({ cState: 'RUNNING', cMsg: 'Running.' }));
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('fetch error: ', error);
        },
      );
    // dispatch() -> set list
    // console.log('Setting selected ship: index [', index, '], id [', id, '] key', key, ']');
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
};

// Set details of the selected ship
export const updateOwnedSearchList = (ownedShips: ShipSimple[]): AppThunk => async (dispatch: AppDispatch) => {
  try {
    const oLen = ownedShips.length;
    batch(() => {
      dispatch(setOwnedSearchList(ownedShips));
      if (oLen !== 0) {
        dispatch(setListState({ key: 'owned', data: { id: ownedShips[0].id, index: 0 } }));
      } else {
        dispatch(setListState({ key: 'owned', data: { id: 'NONE', index: 0 } }));
      }
    });
  } catch (e) {
    console.log('Set Selected Ship error: ', e);
  }
};

export default appStateSlice.reducer;
