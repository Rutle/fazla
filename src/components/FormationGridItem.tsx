/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { hullTypes, hullTypesAbb } from '../data/categories';

interface GridItemProps {
  index: number;
  ship?: Ship;
  themeColor: string;
  onClick: () => void;
}

/**
 * Singular component representing a grid item on a formation.
 */
// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = React.memo(({ index, ship, themeColor, onClick }) => {
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

  const onRightClick = useCallback(() => {
    dispatch(formationAction(FormationAction.RemoveShip, process.env.PLAT_ENV as string, { gridIndex: index }));
  }, [dispatch, index]);

  const getHullTypeAbb = (hullType: string | undefined) => {
    if (!hullType) return '-';
    return hullTypesAbb[hullTypes[hullType]];
  };

  const getHullType = (shipItem: Ship | undefined) => {
    if (shipItem && shipItem.hullType) return hullTypes[shipItem.hullType];
    return '';
  };

  return (
    <div className="grid-item">
      <div
        tabIndex={0}
        className="content"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick();
        }}
        onContextMenu={onRightClick}
        data-tip
        data-for="click-help"
        data-delay-show="1000"
        data-background-color={`var(--main-${themeColor}-tooltip-bg)`}
        data-border
        data-border-color={`var(--main-${themeColor}-tooltip-border)`}
        data-text-color={`var(--main-${themeColor}-color)`}
      >
        {ship !== undefined ? (
          <div className={`hullTypeAbb ${getHullType(ship)}`}>{`${getHullTypeAbb(ship.hullType)} ${
            ship.names.en
          }`}</div>
        ) : (
          <div className="details">{`Add ${getLocation(index)}`}</div>
        )}
      </div>
    </div>
  );
});

export default FormationGridItem;
