/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Ship } from '../utils/shipdatatypes';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';
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
    dispatch(formationAction(FormationAction.RemoveShip, index));
  }, [dispatch, index]);

  return (
    <div className="grid-item">
      <div
        className={`content`}
        onClick={onClick}
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
          <div
            className={`${ship.hullType !== undefined ? hullTypes[ship.hullType] : ''}`}
            style={{ display: 'flex', flexDirection: 'row', padding: '2px 5px' }}
          >
            <div className="hull-type">{ship.hullType !== undefined ? hullTypesAbb[hullTypes[ship.hullType]] : ''}</div>
            <div className={`details`}>{ship.names.en}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', padding: '2px 5px' }}>
            <div className={`details`}>{`Add ${getLocation(index)}`}</div>
          </div>
        )}
        {/* <div className={'pos-indicator'}>{getLocation(index)}</div>*/}
      </div>
    </div>
  );
});

export default FormationGridItem;
