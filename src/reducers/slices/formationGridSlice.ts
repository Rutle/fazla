import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_reducers/store';
import { saveFormationData } from '_/utils/ipcAPI';
import { Formation } from '_/types/types';
import DataStore from '_/utils/dataStore';
import { batch } from 'react-redux';
import { setErrorMessage, setIsUpdated } from './appStateSlice';
import { SearchAction, setFleet, updateSearch } from './searchParametersSlice';

export enum FormationAction {
  New = 'NEW',
  Remove = 'REMOVE',
  Rename = 'RENAME',
  Save = 'SAVE',
  AddShip = 'ADDSHIP',
  RemoveShip = 'REMOVESHIP',
  Export = 'EXPORT',
  Import = 'IMPORT',
  Search = 'SEARCH',
  Switch = 'SWITCH',
}

export const MAININDEX: { [key: number]: number[] } = {
  2: [0, 1, 2, 6, 7, 8],
  3: [0, 1, 2, 6, 7, 8],
  4: [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20],
  5: [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20],
};
export const VANGUARDINDEX: { [key: number]: number[] } = {
  2: [3, 4, 5, 9, 10, 11],
  3: [3, 4, 5, 9, 10, 11],
  4: [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23],
  5: [3, 4, 5, 9, 10, 11, 15, 16, 17, 21, 22, 23],
};
export const SUBMARINE: { [key: number]: number[] } = {
  2: [12, 13, 14],
  3: [12, 13, 14],
  4: [24, 25, 26],
  5: [24, 25, 26],
};

interface Formations {
  formations: Formation[];
  selectedIndex: number;
  isEdit: boolean[];
}
const initialState: Formations = {
  formations: [],
  selectedIndex: NaN, // Selected formation index
  isEdit: [],
};

const formationGridSlice = createSlice({
  name: 'formationGridSlice',
  initialState,
  reducers: {
    addShipToFormation(state, action: PayloadAction<{ id: string; gridIndex: number; selectedIndex: number }>) {
      const { id, gridIndex, selectedIndex } = action.payload;
      const newForms = state.formations.map((item, index) => {
        if (index !== selectedIndex) {
          return item;
        }
        return {
          ...item,
          data: item.data.map((value, index2) => {
            if (index2 !== gridIndex && value !== id) {
              return value;
            }
            if (index2 !== gridIndex && value === id) {
              return 'NONE';
            }
            return id;
          }),
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index) => (index !== selectedIndex ? value : true)),
      };
    },
    resetFormation() {
      return initialState;
    },
    renameFormation(state, action: PayloadAction<{ idx: number; name: string }>) {
      const { idx, name } = action.payload;
      const newForms = state.formations.map((item, index) => {
        if (index !== idx) {
          return item;
        }
        return {
          ...item,
          name,
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index) => (index !== idx ? value : true)),
      };
    },
    setFormationsData(state, action: PayloadAction<Formation[]>) {
      const count = action.payload.length;
      const newEditArray = Array(count).fill(false);
      return {
        ...state,
        formations: action.payload,
        selectedIndex: count >= 0 ? 0 : NaN,
        isEdit: newEditArray,
      };
    },
    addNewFormationData(state, action: PayloadAction<Formation>) {
      const newList = [...state.formations.slice(), action.payload];
      const newEdit = [...state.isEdit.slice(), true];
      return {
        ...state,
        formations: newList,
        selectedIndex: newList.length - 1,
        isEdit: newEdit,
      };
    },
    removeFormation(state, action: PayloadAction<number>) {
      const idx = action.payload;
      const newForms = state.formations.filter((item, index) => index !== idx) as Formation[];
      const newEdit = state.isEdit.filter((item, index) => index !== idx);
      const newLen = newForms.length;
      let newIdx = 0;
      if (idx === 0 && newLen > 0) {
        newIdx = 0;
      } else if (idx !== 0 && newLen > 0) {
        newIdx = idx - 1;
      } else {
        newIdx = NaN;
      }
      return {
        ...state,
        formations: newForms,
        selectedIndex: newIdx,
        isEdit: newEdit,
      };
    },
    selectFormation(state, action: PayloadAction<number>) {
      return {
        ...state,
        selectedIndex: action.payload,
      };
    },
    switchPlacements(state, action: PayloadAction<{ data: string[]; fleetIndex: number }>) {
      const { data, fleetIndex } = action.payload;
      const fromIdx = parseInt(data[0], 10);
      const toIdx = parseInt(data[1], 10);
      const newFleet = state.formations[fleetIndex].data.slice();
      const fromID = newFleet[fromIdx];
      const toID = newFleet[toIdx];
      newFleet[fromIdx] = toID;
      newFleet[toIdx] = fromID;
      const newForms = state.formations.map((item, index) => {
        if (index !== fleetIndex) {
          return item;
        }
        return {
          ...item,
          data: newFleet,
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index) => (index !== fleetIndex ? value : true)),
      };
    },
    toggleEdit(state) {
      const arrLen = state.isEdit.length;
      const newArr = Array.from({ length: arrLen }, () => false);
      return {
        ...state,
        isEdit: newArr,
      };
    },
    removeShipFromFormation(state, action: PayloadAction<{ gridIndex: number; selectedIndex: number }>) {
      const { gridIndex, selectedIndex } = action.payload;
      const newForms = state.formations.map((item, index) => {
        if (index !== selectedIndex) {
          return item;
        }
        return {
          ...item,
          data: item.data.map((value, index2) => (index2 !== gridIndex ? value : 'NONE')),
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index3) => (index3 !== selectedIndex ? value : true)),
      };
    },
  },
});

export const {
  addShipToFormation,
  resetFormation,
  renameFormation,
  setFormationsData,
  addNewFormationData,
  removeFormation,
  selectFormation,
  toggleEdit,
  removeShipFromFormation,
  switchPlacements,
} = formationGridSlice.actions;

interface FormActionData {
  gridIndex?: number;
  formationName?: string;
  formationType?: string;
  importedFormation?: string[];
  storage?: LocalForage;
  shipData?: DataStore;
  switchData?: string[];
}

/**
 * Formation view related actions
 * @param {FormationAction} action Enum action
 * @param {FormActionData} data Object containing data for different actions
 */
export const formationAction =
  (action: FormationAction, data: FormActionData): AppThunk =>
  async (dispatch: AppDispatch, getState) => {
    let result: { isOk: boolean; msg: string } = { isOk: false, msg: '' };
    try {
      const { formationGrid, appState } = getState();
      const formIdx = formationGrid.selectedIndex; // Which formation is selected.
      const formCount = formationGrid.formations.length;
      const { id } = appState[appState.cToggle]; // ID of selected ship when adding ship to a fleet.
      const list = appState.cToggle;
      const name = data.formationName || `Formation ${formCount}`;
      const fType = data.formationType || 'normal';
      const iFormation = data.importedFormation;
      const shipGridIndex = data.gridIndex; // Ship selected on the grid of ships.
      const { storage, shipData } = data;
      let emptyFormation = [];
      switch (action) {
        case 'NEW':
          if (fType === 'normal') {
            // 12 normal ships and 3 submarines
            emptyFormation = Array.from({ length: 15 }, () => 'NONE');
          } else {
            // 24 normal ships and 3 submarines
            emptyFormation = Array.from({ length: 27 }, () => 'NONE');
          }
          dispatch(addNewFormationData({ data: emptyFormation, name }));
          break;
        case 'REMOVE':
          batch(() => {
            dispatch(removeFormation(formIdx));
            dispatch(formationAction(FormationAction.Save, { storage }));
          });
          break;
        case 'RENAME':
          dispatch(renameFormation({ idx: formIdx, name }));
          break;
        case 'SAVE':
          {
            const platform = process.env.PLAT_ENV;
            result = await saveFormationData(formationGrid.formations, platform as string, storage);
            if (result.isOk) dispatch(toggleEdit());
          }
          break;
        case 'ADDSHIP':
          // Add ship and reset list.
          if (shipGridIndex !== undefined && !Number.isNaN(shipGridIndex) && shipData) {
            batch(() => {
              dispatch(addShipToFormation({ id, gridIndex: shipGridIndex, selectedIndex: formIdx }));
              dispatch(setFleet({ fleet: 'ALL' }));
              dispatch(setIsUpdated({ key: list, value: false }));
              // dispatch(resetParameters());
              dispatch(updateSearch(shipData, SearchAction.UpdateList, { list }));
            });
          }
          break;
        case 'REMOVESHIP':
          if (shipGridIndex) {
            dispatch(removeShipFromFormation({ gridIndex: shipGridIndex, selectedIndex: formIdx }));
          }
          break;
        case 'IMPORT':
          if (iFormation) {
            dispatch(addNewFormationData({ data: iFormation, name }));
          }
          break;
        case 'SWITCH':
          if (data && data.switchData) dispatch(switchPlacements({ data: data.switchData, fleetIndex: formIdx }));
          break;
        default:
          break;
      }
    } catch (e) {
      let msg = '';
      // let msg = 'There was an error with formation action.';
      if (e instanceof Error) {
        msg = e.message;
      }
      dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: msg, eState: 'WARNING' }));
    }
  };

export default formationGridSlice.reducer;
