import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../../store';
import { saveFormationData, removeAFormation } from '../../util/appUtilities';
import { Formation } from '../../util/types';
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
          data: item.data.map((value, index) => {
            if (index !== gridIndex && value !== id) {
              return value;
            } else if (index !== gridIndex && value === id) {
              return '';
            } else {
              return id;
            }
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
          data: item.data.map((value, index) => (index !== gridIndex ? value : 'NONE')),
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index) => (index !== selectedIndex ? value : true)),
      };
    },
  },
});

export const {
  addShipToFormation,
  resetFormation,
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
export const formationAction = (action: FormationAction, gridIndex?: number): AppThunk => async (
  dispatch: AppDispatch,
  getState,
) => {
  try {
    const { formationGrid, formationModal, shipDetails } = getState();
    const formIdx = formationGrid.selectedIndex;
    const { id } = shipDetails;

    switch (action) {
      case 'NEW':
        const formCount = formationGrid.formations.length;
        const emptyFormation = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
        dispatch(addNewFormationData({ data: emptyFormation, name: `Formation ${formCount}` }));
        break;
      case 'REMOVE':
        await removeAFormation(formIdx).then((result) => {
          dispatch(removeFormation(formIdx));
        });
        break;
      case 'RENAME':
        break;
      case 'SAVE':
        await saveFormationData(formationGrid.formations).then((result) => {
          dispatch(toggleIsEdit(formIdx));
        });
        break;
      case 'ADDSHIP':
        const gIndex = formationModal.gridIndex;
        dispatch(addShipToFormation({ id, gridIndex: gIndex, selectedIndex: formIdx }));
        break;
      case 'REMOVESHIP':
        dispatch(removeShipFromFormation({ gridIndex: gridIndex as number, selectedIndex: formIdx }));
        break;
      case 'SAVEALL':
        await saveFormationData(formationGrid.formations);
        break;
      default:
        break;
    }
  } catch (e) {
    dispatch(setErrorMessage({ cState: 'ERROR', eMsg: e.message }));
  }
};

export default formationGridSlice.reducer;
