import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '_reducers/store';
import { saveFormationData } from '_/utils/ipcAPI';
import { Formation } from '_/types/types';
import DataStore from '_/utils/dataStore';
import { batch } from 'react-redux';
import { CallbackDismiss, ToastMessageType } from '_/hooks/useToast';
import { initShipData, setErrorMessage } from './appStateSlice';
import { SearchAction, setFleet, updateSearch } from './searchParametersSlice';

export enum FormationAction {
  New = 'NEW',
  Remove = 'REMOVE',
  Rename = 'RENAME',
  Save = 'SAVE',
  AddShip = 'ADDSHIP',
  Insert = 'INSERT',
  RemoveShip = 'REMOVESHIP',
  Export = 'EXPORT',
  Import = 'IMPORT',
  Search = 'SEARCH',
  Switch = 'SWITCH',
  AddEq = 'ADDEQ',
  Convert = 'CONVERT',
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
  isEdit: boolean[]; // Might be redundant and instead could use a single value.
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
    addShipToFormation(state, action: PayloadAction<{ id: string; shipIndex: number; selectedFleetIndex: number }>) {
      const { id, shipIndex, selectedFleetIndex } = action.payload;
      const newForms = state.formations.map((item, index) => {
        if (index !== selectedFleetIndex) {
          return item;
        }
        // Get the old index of the ship in case it already was in the formation.
        // We need it to replace the equipment of the old ship location with empty values.
        let oldIndex = NaN;
        const shipData = item.data.map((value, index2) => {
          // Keep the current value. Not the one we are searching
          if (index2 !== shipIndex && value !== id) {
            return value;
          }
          // Remove the duplicate ID value.
          if (index2 !== shipIndex && value === id) {
            oldIndex = index2;
            return 'N';
          }
          // Add the ID.
          return id;
        });
        let newEq: string[] | string[][] = [];
        const isOld = item.equipment.length === 15 || item.equipment.length === 27;
        // Old equipment data structure
        if (isOld) {
          newEq = item.equipment.map((value, index2) => {
            if (index2 === shipIndex) {
              return ['N', 'N', 'N'];
            }
            if (!Number.isNaN(oldIndex) && index2 === oldIndex) {
              return ['N', 'N', 'N'];
            }
            return value;
          }) as string[][];
        } else {
          // New equipment data structure
          newEq = item.equipment.slice();
          // Equipment in old index
          let oldIndexEq: string[] = [];
          if (!Number.isNaN(oldIndex)) {
            oldIndexEq = newEq.slice(oldIndex * 3, oldIndex * 3 + 3) as string[];
            newEq = [
              ...newEq.slice(0, oldIndex * 3),
              ...newEq.slice(oldIndex * 3, oldIndex * 3 + 3).map(() => 'N'),
              ...newEq.slice(oldIndex * 3 + 3),
            ] as string[];
          }
          // Replace equipment in new place with either 'N' values or
          // transfer equipment from old index.
          newEq = [
            ...newEq.slice(0, shipIndex * 3),
            ...newEq
              .slice(shipIndex * 3, shipIndex * 3 + 3)
              .map((v, i) => (!Number.isNaN(oldIndex) ? oldIndexEq[i] : 'N')),
            ...newEq.slice(shipIndex * 3 + 3),
          ] as string[];
        }
        return {
          ...item,
          data: shipData,
          equipment: newEq,
        };
      });

      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index) => (index !== selectedFleetIndex ? value : true)),
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
      const newData = state.formations[fleetIndex].data.slice();
      let newEq = state.formations[fleetIndex].equipment.slice();
      const isOld = newEq.length === 15 || newEq.length === 27;
      if (isOld) {
        // Old style equipment data structure
        const oldSpot = newEq[fromIdx];
        const newSpot = newEq[toIdx];
        newEq[fromIdx] = newSpot;
        newEq[toIdx] = oldSpot;
      } else {
        // Get equipment from old index and new index.
        const oldIndexEq = newEq.slice(fromIdx * 3, fromIdx * 3 + 3);
        const newIndexEq = newEq.slice(toIdx * 3, toIdx * 3 + 3);

        // Move equipment from new index to old index.
        newEq = [
          ...newEq.slice(0, fromIdx * 3),
          ...newEq.slice(fromIdx * 3, fromIdx * 3 + 3).map((v, i) => newIndexEq[i]),
          ...newEq.slice(fromIdx * 3 + 3),
        ] as string[];

        // Move equipment from old index to new index.
        newEq = [
          ...newEq.slice(0, toIdx * 3),
          ...newEq.slice(toIdx * 3, toIdx * 3 + 3).map((v, i) => oldIndexEq[i]),
          ...newEq.slice(toIdx * 3 + 3),
        ] as string[];
      }
      const fromID = newData[fromIdx];
      const toID = newData[toIdx];
      newData[fromIdx] = toID;
      newData[toIdx] = fromID;

      const newForms = state.formations.map((item, index) => {
        if (index !== fleetIndex) {
          return item;
        }
        return {
          ...item,
          data: newData,
          equipment: newEq,
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
      let newEq = state.formations[selectedIndex].equipment.slice();
      const isOld = newEq.length === 15 || newEq.length === 27;
      if (isOld) {
        newEq[gridIndex] = ['N', 'N', 'N'];
      } else {
        newEq = [
          ...newEq.slice(0, gridIndex * 3),
          ...newEq.slice(gridIndex * 3, gridIndex * 3 + 3).map(() => 'N'),
          ...newEq.slice(gridIndex * 3 + 3),
        ] as string[];
      }
      const newForms = state.formations.map((item, index) => {
        if (index !== selectedIndex) {
          return item;
        }
        return {
          ...item,
          data: item.data.map((value, index2) => (index2 !== gridIndex ? value : 'N')),
          equipment: newEq,
        };
      });
      return {
        ...state,
        formations: newForms,
        isEdit: state.isEdit.map((value, index3) => (index3 !== selectedIndex ? value : true)),
      };
    },
    addEquipmentToShipSlot(
      state,
      action: PayloadAction<{
        formIdx: number;
        shipIdx: number;
        fleetIdx: number;
        slotIdx: number;
        eqId: string;
        isOldFormation: boolean;
      }>
    ) {
      const { formIdx, shipIdx, slotIdx, eqId, isOldFormation, fleetIdx } = action.payload;
      const newForms = state.formations.map((item, index) => {
        if (index !== formIdx) {
          return item;
        }
        return {
          ...item,
          equipment: item.equipment.map((value, index2) => {
            if (isOldFormation && typeof value === 'object') {
              if (index2 === shipIdx) {
                return value.map((v, i) => (i === slotIdx ? eqId : v));
              }
            } else if (index2 === shipIdx * 3 + slotIdx && !isOldFormation) {
              return eqId;
            }
            return value;
          }),
        };
      });
      return {
        ...state,
        formations: newForms as Formation[],
        isEdit: state.isEdit.map((value, index) => (index !== fleetIdx ? value : true)),
      };
    },

    convertFormation(state, action: PayloadAction<{ formIdx: number; type?: 'SUB' | 'EQSTRUCTURE' }>) {
      const { formIdx, type } = action.payload;
      const newEq = state.formations[formIdx].equipment.slice().flat();
      const newFleet = state.formations[formIdx].data.slice();
      if (type === 'SUB') {
        newEq.push(...Array.from({ length: 9 }, () => 'N').flat());
        newFleet.push(...Array.from({ length: 3 }, () => 'N').flat());
      }
      const newForms = state.formations.map((item, index) => {
        if (index !== formIdx) {
          return item;
        }
        if (type === 'SUB') {
          return {
            ...item,
            data: newFleet,
            equipment: newEq,
          };
        }
        return {
          ...item,
          equipment: newEq,
        };
      });

      return {
        ...state,
        formations: newForms as Formation[],
        isEdit: state.isEdit.map((value, index) => (index !== formIdx ? value : true)),
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
  addEquipmentToShipSlot,
  convertFormation,
} = formationGridSlice.actions;

interface FormActionData {
  gridIndex?: number;
  formationName?: string;
  formationType?: string;
  importedFormation?: Formation;
  storage?: LocalForage;
  shipData?: DataStore;
  switchData?: string[];
  insertData?: { gridIndex: number; shipID: string };
  eqData?: {
    formIdx: number;
    fleetIdx: number;
    shipIdx: number;
    slotIdx: number;
    isOldFormation: boolean;
    eqId: string;
  };
  convertType?: 'SUB' | 'EQSTRUCTURE';
}

/**
 * Formation view related actions
 * @param {FormationAction} action Enum action
 * @param {FormActionData} data Object containing data for different actions
 */
export const formationAction =
  (
    action: FormationAction,
    data: FormActionData,
    addToast?: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void
  ): AppThunk =>
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
      const { eqData } = data; // When an equipment is added.
      const cType = data.convertType;
      let emptyFormation: string[] = [];
      let emptyEquips: string[] = [];
      switch (action) {
        case 'NEW':
          if (fType === 'normal') {
            // 12 normal ships and 3 submarines
            emptyFormation = Array.from({ length: 15 }, () => 'N');
            emptyEquips = Array.from({ length: 15 * 3 }, () => 'N');
          } else {
            // 24 normal ships and 3 submarines
            emptyFormation = Array.from({ length: 27 }, () => 'N');
            emptyEquips = Array.from({ length: 27 * 3 }, () => 'N');
          }
          dispatch(addNewFormationData({ data: emptyFormation, name, equipment: emptyEquips }));
          if (addToast) addToast('info', 'New formation', 'New formation was created.');
          break;
        case 'REMOVE':
          {
            const removedName = formationGrid.formations[formIdx].name;
            batch(() => {
              dispatch(removeFormation(formIdx));
              dispatch(formationAction(FormationAction.Save, { storage }));
              if (addToast) addToast('info', 'Formation removal', `${removedName} was removed.`);
            });
          }
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
              dispatch(addShipToFormation({ id, shipIndex: shipGridIndex, selectedFleetIndex: formIdx }));
              dispatch(setFleet({ fleet: 'ALL' }));
              // dispatch(setIsUpdated({ key: list, value: false }));
              // dispatch(resetParameters());
              dispatch(updateSearch(shipData, SearchAction.UpdateList, { list }));
            });
          }
          break;
        case 'INSERT':
          if (data.insertData) {
            const { gridIndex, shipID } = data.insertData;
            dispatch(addShipToFormation({ id: shipID, shipIndex: gridIndex, selectedFleetIndex: formIdx }));
          }
          break;
        case 'REMOVESHIP':
          if (shipGridIndex !== undefined) {
            dispatch(removeShipFromFormation({ gridIndex: shipGridIndex, selectedIndex: formIdx }));
          }
          break;
        case 'IMPORT':
          if (iFormation) {
            dispatch(addNewFormationData(iFormation));
            if (addToast) addToast('info', 'Formation import', `${iFormation.name} was imported.`);
          }
          break;
        case 'SWITCH':
          if (data && data.switchData) dispatch(switchPlacements({ data: data.switchData, fleetIndex: formIdx }));
          break;
        case 'ADDEQ':
          if (eqData) {
            dispatch(addEquipmentToShipSlot(eqData));
          }
          break;
        case 'CONVERT':
          dispatch(convertFormation({ formIdx, type: cType }));
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
      dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: msg }));
    }
  };

export default formationGridSlice.reducer;
