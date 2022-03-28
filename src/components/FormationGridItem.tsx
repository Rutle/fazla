// import * as React from 'react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fleets } from '_/data/categories';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/shipTypes';
import { getFleet } from '_/utils/appUtilities';
import { useDragAndDrop, UseDragAndDropFunctions } from '../hooks/useDragAndDrop';
import RButton from './RButton/RButton';

/**
 * Function to check if drop zone is valid.
 * @param fleetCount Number of fleets
 * @param main Object containing list of main fleet indexes based on fleetcount.
 * @param vanguard Object containing list of vanguard fleet indexes based on fleetcount.
 * @returns true if valid, false otherwise.
 */
const isValidDropZone =
  (fleetHulls: { MAIN: string[]; VANGUARD: string[]; SUBS: string[] }) =>
  (startKey: string, overKey: string): boolean => {
    if (startKey === 'none' || overKey === 'none') return false;
    if (startKey === overKey) return true;
    if (
      (fleetHulls.MAIN.includes(startKey) && fleetHulls.MAIN.includes(overKey)) ||
      (fleetHulls.MAIN.includes(startKey) && overKey === 'main')
    )
      return true;
    if (
      (fleetHulls.VANGUARD.includes(startKey) && fleetHulls.VANGUARD.includes(overKey)) ||
      (fleetHulls.VANGUARD.includes(startKey) && overKey === 'vanguard')
    )
      return true;
    if (
      (fleetHulls.SUBS.includes(startKey) && fleetHulls.SUBS.includes(overKey)) ||
      (fleetHulls.SUBS.includes(startKey) && overKey === 'submarine')
    )
      return true;
    return false;
  };

interface GridItemProps {
  index: number;
  ship?: Ship;
  themeColor: string;
  onClick: () => void;
  isSelected: boolean;
  dragFunctions?: UseDragAndDropFunctions;
  isDragged?: boolean;
  isSub?: boolean;
  fleetCount: number;
  isInteractive?: boolean;
}

/**
 * Singular component representing a grid item on a formation.
 */
const FormationGridItem: React.FC<GridItemProps> = ({
  index,
  ship,
  themeColor,
  onClick,
  isSelected,
  // dragFunctions,
  // isDragged,
  fleetCount,
  isSub = false,
  isInteractive = true,
}) => {
  const { dragFunctions, dragStates, transferData } = useDragAndDrop({
    dataKeys: ['grid-index', 'transfer-type', 'ship-id', getFleet({ index, fleetCount })],
    baseKey: getFleet({ index, fleetCount }),
    overKey: 'fleet',
    isValidDropZone: isValidDropZone(fleets),
  });
  const dispatch = useDispatch();
  // console.log(`Rendering `, ship?.names.en);
  useEffect(() => {
    // Finished drag and drop.
    if (!dragStates.isDragged && dragStates.isTransferOk) {
      const { start, end } = transferData;
      if (start['transfer-type'] === 'switch') {
        // Drag within formation
        /* if (vanRef && vanRef.current) {
            // console.log(vanRef.current.children.length);
            // TODO: Remove drag over borders from child elements.
          } */
        dispatch(
          formationAction(FormationAction.Switch, {
            switchData: [start['grid-index'], end['grid-index']],
          })
        );
      } else if (start['transfer-type'] === 'insert') {
        // Drag from ship list to formation.
        const gridIndex = Number.parseInt(end['grid-index'], 10);
        const shipID = start['ship-id'];
        dispatch(formationAction(FormationAction.Insert, { insertData: { gridIndex, shipID } }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferData, dispatch, dragStates]);

  const getLocation = (idx: number): string => {
    switch (idx) {
      case 1:
      case 7:
      case 13:
      case 19:
        return 'flagship';
      case 3:
      case 9:
      case 15:
      case 21:
        return 'frontmost';
      case 5:
      case 11:
      case 17:
      case 23:
        return 'backmost';
      default:
        return 'ship';
    }
  };

  const onRightClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.button === 2) e.preventDefault();
    dispatch(formationAction(FormationAction.RemoveShip, { gridIndex: index }));
  };
  return (
    <>
      {isInteractive ? (
        <RButton
          onClick={onClick}
          onRightClick={onRightClick}
          className={`grid-item ship btn hullTypeAbb ${ship?.hullType || 'none'}`}
          themeColor={themeColor}
          dragProps={{
            dragFunctions,
            dragOptions: { draggable: 'true' },
            data: {
              'grid-index': index,
              'ship-id': ship?.id || 'none',
              'transfer-type': 'switch',
              fleet: getFleet({ index, fleetCount }),
              ...{ [getFleet({ index, fleetCount })]: 'fleet' },
            },
          }}
        >
          <span>{ship ? `${ship.names.en}` : `Add ${!isSub ? getLocation(index) : 'ship'}`}</span>
        </RButton>
      ) : (
        <div
          className={`grid-item ship non-interactive ${themeColor} hullTypeAbb ${ship?.hullType || 'none'}`}
          style={{ borderRadius: '4px', display: 'inline-block' }}
        >
          <span>{ship ? `${ship.names.en}` : `Empty`}</span>
        </div>
      )}
    </>
  );
};

export default FormationGridItem;
