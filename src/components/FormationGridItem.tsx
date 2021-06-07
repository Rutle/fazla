import * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { getFleet } from '_/utils/appUtilities';
import { UseDragAndDropFunctions } from './DragAndDrop/useDragAndDrop';
import RButton from './RButton/RButton';

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
}

/**
 * Singular component representing a grid item on a formation.
 */
const FormationGridItem: React.FC<GridItemProps> = React.memo(
  ({ index, ship, themeColor, onClick, isSelected, dragFunctions, isDragged, fleetCount, isSub = false }) => {
    const dispatch = useDispatch();
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

    const onRightClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e.button === 2) e.preventDefault();
        dispatch(formationAction(FormationAction.RemoveShip, { gridIndex: index }));
      },
      [dispatch, index]
    );

    return (
      <RButton
        onClick={onClick}
        onRightClick={onRightClick}
        className={`grid-item btn${isSelected ? ' selected' : ''} hullTypeAbb ${ship?.hullType || 'none'}`}
        themeColor={themeColor}
        extraStyle={{ border: '2px solid transparent' }}
        dragProps={{
          dragFunctions,
          dragOptions: { draggable: 'true' },
          data: {
            'grid-index': index,
            'ship-id': ship?.id || 'none',
            'transfer-type': 'switch',
            hull: ship?.hullType || getFleet(index, fleetCount),
          },
        }}
      >
        <span
          style={{
            width: '100%',
            height: '100%',
            display: 'inline-block',
            boxSizing: 'border-box',
          }}
        >
          {ship ? `${ship.names.en}` : `Add ${!isSub ? getLocation(index) : 'ship'}`}
        </span>
      </RButton>
    );
  }
);

export default FormationGridItem;
