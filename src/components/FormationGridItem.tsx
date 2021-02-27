/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { hullTypes, hullTypesAbb } from '../data/categories';
import RButton from './RButton/RButton';

interface GridItemProps {
  index: number;
  ship?: Ship;
  themeColor: string;
  onClick: () => void;
  isSelected: boolean;
}

/**
 * Singular component representing a grid item on a formation.
 */
const FormationGridItem: React.FC<GridItemProps> = React.memo(({ index, ship, themeColor, onClick, isSelected }) => {
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

  const getHullTypeAbb = (hullType: string | undefined) => {
    if (!hullType) return '-';
    return hullTypesAbb[hullTypes[hullType]];
  };

  const getHullType = (shipItem: Ship | undefined) => {
    if (shipItem && shipItem.hullType) return hullTypes[shipItem.hullType];
    return '';
  };
  return (
    <RButton
      onClick={onClick}
      onRightClick={onRightClick}
      className={`grid-item btn${isSelected ? ' selected' : ''} hullTypeAbb ${ship ? getHullType(ship) : ''}`}
      themeColor={themeColor}
    >
      {ship ? `${getHullTypeAbb(ship.hullType)} ${ship.names.en}` : `Add ${getLocation(index)}`}
    </RButton>
  );
  /*
  return (
    <div className="grid-item">
      <div
        tabIndex={0}
        className="content"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick();
        }}
        onContextMenu={(e) => onRightClick(e)}
      >
        {ship !== undefined ? (
          <div className={`hullTypeAbb ${getHullType(ship)}`}>
            {`${getHullTypeAbb(ship.hullType)} ${ship.names.en}`}
          </div>
        ) : (
          <div className={`details ${isSelected ? 'selected' : ''}`}>{`Add ${getLocation(index)}`}</div>
        )}
      </div>
    </div>
  ); */
});

export default FormationGridItem;
