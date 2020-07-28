import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setDetails, resetDetails } from './shipDetailsSlice';
import { getShipById, ShipSimple } from '../../util/shipdata';
import { batch } from 'react-redux';
import { AppThunk, AppDispatch } from '../../store';
import { setList } from './shipSearchListSlice';
import { setOwnedSearchList } from './ownedSearchListSlice';

interface ListState {
  id: string;
  index: number;
}

interface ListStateObject {
  [key: string]: any;
  all: ListState;
  owned: ListState;
}
const initialState: ListStateObject = {
  currentToggle: 'all',
  isInitState: true,
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
    toggleInitState(state) {
      return {
        ...state,
        isInitState: !state.isInitState,
      };
    },
    resetList() {
      return initialState;
    },
  },
});

export const { setListState, resetList, setCurrentToggle, toggleInitState } = listStateSlice.actions;

export const initListState = (
  key: string,
  index: number,
  id: string,
  key2: string,
  index2: number,
  id2: string,
): AppThunk => async (dispatch: AppDispatch) => {
  try {
    console.log('[Init] Setting list states');
    batch(() => {
      dispatch(setDetails(getShipById(id)));
      dispatch(setListState({ key: key, data: { id: id, index: index } }));
      dispatch(setListState({ key: key2, data: { id: id2, index: index2 } }));
      dispatch(toggleInitState());
    });
  } catch (e) {
    console.log('Setting list states error: ', e);
  }
};

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
      // Set empty state in case search is empty. Check for it in ShipList/ShipDetailView/ShipDetails
      // SetList / setOwnedSearchList -> empty list, ListState has to have empty values.
      dispatch(setList(allShips));
      dispatch(setListState({ key: 'all', data: { id: allShips[0].id, index: 0 } }));
      dispatch(setOwnedSearchList(ownedShips));
      dispatch(setListState({ key: 'owned', data: { id: ownedShips[0].id, index: 0 } }));
    });
  } catch (e) {
    console.log('setSearchResults error: ', e);
  }
};
export default listStateSlice.reducer;
