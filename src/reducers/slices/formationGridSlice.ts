import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_reducers/store';
import { saveFormationData, removeAFormation, renameAFormation } from '../../utils/appUtilities';
import { Formation } from '../../utils/types';
import { setErrorMessage } from './appStateSlice';

export enum FormationAction {
  New = 'NEW',
  Remove = 'REMOVE',
  Rename = 'RENAME',
  Save = 'SAVE',
  AddShip = 'ADDSHIP',
  RemoveShip = 'REMOVESHIP',
  SaveAll = 'SAVEALL',
  Export = 'EXPORT',
  Import = 'IMPORT',
}

interface Formations {
  formations: Formation[];
  selectedIndex: number;
  isEdit: boolean[];
}
const initialState: Formations = {
  formations: [],
  selectedIndex: NaN,
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
      const newForms = state.formations.filter((item, index) => index !== idx);
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
    toggleIsEdit(state, action: PayloadAction<number>) {
      const selectedIdx = action.payload;
      return {
        ...state,
        isEdit: state.isEdit.map((value, index) => (index !== selectedIdx ? value : !value)),
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
  toggleIsEdit,
  removeShipFromFormation,
} = formationGridSlice.actions;

interface FormActionData {
  gridIndex?: number;
  formationName?: string;
  formationType?: string;
  importedFormation?: string[];
}

/**
 * Updates all ships search list.
 * @param {FormationAction} action Enum action
 */
export const formationAction = (action: FormationAction, data: FormActionData): AppThunk => async (
  dispatch: AppDispatch,
  getState
) => {
  try {
    const { formationGrid, formationModal, shipDetails } = getState();
    const formIdx = formationGrid.selectedIndex; // Which formation is selected.
    const formCount = formationGrid.formations.length;
    const { id } = shipDetails; // ID of selected ship when adding ship to a fleet.
    const gIndex = formationModal.gridIndex; // Ship selected on the grid of ships.
    const name = data.formationName || `Formation ${formCount}`;
    const fType = data.formationType || 'normal';
    const iFormation = data.importedFormation || [];
    const shipGridIndex = data.gridIndex || 0;
    let emptyFormation = [];
    switch (action) {
      case 'NEW':
        if (fType === 'normal') {
          emptyFormation = Array.from({ length: 12 }, (v, i) => 'NONE');
        } else {
          emptyFormation = Array.from({ length: 24 }, (v, i) => 'NONE');
        }
        dispatch(addNewFormationData({ data: emptyFormation, name }));
        break;
      case 'REMOVE':
        await removeAFormation(formIdx).then((result) => {
          if (result.isOk) dispatch(removeFormation(formIdx));
          dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: result.msg, eState: 'WARNING' }));
        });
        break;
      case 'RENAME':
        await renameAFormation(formIdx, name).then((result) => {
          if (result.isOk) dispatch(renameFormation({ idx: formIdx, name }));
        });
        break;
      case 'SAVE':
        await saveFormationData(formationGrid.formations).then((result) => {
          if (result.isOk) dispatch(toggleIsEdit(formIdx));
        });
        break;
      case 'ADDSHIP':
        dispatch(addShipToFormation({ id, gridIndex: gIndex, selectedIndex: formIdx }));
        break;
      case 'REMOVESHIP':
        dispatch(removeShipFromFormation({ gridIndex: shipGridIndex, selectedIndex: formIdx }));
        break;
      case 'SAVEALL':
        await saveFormationData(formationGrid.formations).then((result) => {
          if (!result.isOk) dispatch(setErrorMessage({ cState: 'ERROR', eMsg: result.msg, eState: 'ERROR' }));
        });
        break;
      case 'IMPORT': {
        dispatch(addNewFormationData({ data: iFormation, name }));
        // WyJOT05FIiwiMjI0IiwiNDE5IiwiMDgyIiwiTk9ORSIsIk5PTkUiLCJOT05FIiwiTk9ORSIsIk5PTkUiLCJOT05FIiwiTk9ORSIsIk5PTkUiXQ==
        break;
      }
      default:
        break;
    }
  } catch (e) {
    let msg = 'There was an error with formation action.';
    if (e instanceof SyntaxError) {
      msg = e.message;
    }
    dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: msg, eState: 'WARNING' }));
  }
};

export default formationGridSlice.reducer;
