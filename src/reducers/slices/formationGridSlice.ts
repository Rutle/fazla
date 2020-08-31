import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../../store';
import { saveFormationData, removeAFormation } from '../../util/appUtilities';

export enum FormationAction {
  New = 'NEW',
  Remove = 'REMOVE',
  Rename = 'RENAME',
  Save = 'SAVE',
  AddShip = 'ADDSHIP',
}

interface MiscInformation {
  name: string; // Name displayed on the dropdown list
}

export type Formation = {
  data: string[];
} & MiscInformation;

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
          data: item.data.map((value, index) => (index !== gridIndex ? value : id)),
        };
      });
      /*
      console.log({
        ...state,
        formations: newForms,
        isEdit: true,
      });*/
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
} = formationGridSlice.actions;

/**
 * Updates all ships search list.
 * @param {FormationAction} action Enum action
 */
export const formationAction = (action: FormationAction): AppThunk => async (dispatch: AppDispatch, getState) => {
  try {
    const { formationGrid, formationModal, shipDetails } = getState();
    switch (action) {
      case 'NEW':
        const formCount = formationGrid.formations.length;
        const emptyFormation = ['NONE', 'NONE', 'NONE', 'NONE', 'NONE', 'NONE'];
        dispatch(addNewFormationData({ data: emptyFormation, name: `Formation ${formCount}` }));
        break;
      case 'REMOVE':
        const idx = formationGrid.selectedIndex;
        await removeAFormation(idx).then((result) => {
          console.log('removeAFormation slice', result.isOk);
          dispatch(removeFormation(idx));
        });
        break;
      case 'RENAME':
        break;
      case 'SAVE':
        await saveFormationData(formationGrid.formations).then((result) => {
          console.log('slice', result.isOk);
          const { selectedIndex } = formationGrid;
          dispatch(toggleIsEdit(selectedIndex));
        });
        break;
      case 'ADDSHIP':
        const { id } = shipDetails;
        const { gridIndex } = formationModal;
        const { selectedIndex } = formationGrid;
        dispatch(addShipToFormation({ id, gridIndex, selectedIndex }));
        break;
      default:
        break;
    }
  } catch (e) {
    console.log('createEmptyFormation: ', e);
  }
};

export default formationGridSlice.reducer;
