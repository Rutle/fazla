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
            if (index !== gridIndex && value !== id) {
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

/**
 * Updates all ships search list.
 * @param {FormationAction} action Enum action
 */
export const formationAction = (
  action: FormationAction,
  gridIndex?: number,
  formationName?: string,
  formationType?: string
): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { formationGrid, formationModal, shipDetails } = getState();
    const formIdx = formationGrid.selectedIndex;
    const { id } = shipDetails;
    const gIndex = formationModal.gridIndex;
    const formCount = formationGrid.formations.length;
    const name = formationName || `Formation ${formCount}`;
    const fType = formationType as string;
    let emptyFormation = [];
    switch (action) {
      case 'NEW':
        if (fType === 'normal') {
          emptyFormation = [
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
          ];
        } else {
          emptyFormation = [
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
            'NONE',
          ];
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
        await renameAFormation(gridIndex as number, formationName as string).then((result) => {
          if (result.isOk) dispatch(renameFormation({ idx: gridIndex as number, name: formationName as string }));
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
        dispatch(removeShipFromFormation({ gridIndex: gridIndex as number, selectedIndex: formIdx }));
        break;
      case 'SAVEALL':
        await saveFormationData(formationGrid.formations).then((result) => {
          if (!result.isOk) dispatch(setErrorMessage({ cState: 'ERROR', eMsg: result.msg, eState: 'ERROR' }));
        });
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'There was an error with formation action.', eState: 'ERROR' }));
  }
};

export default formationGridSlice.reducer;
