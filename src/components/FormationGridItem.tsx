/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { formationModalAction, FormationModalAction } from '../reducers/slices/formationModalSlice';
import { Ship } from '../util/shipdatatypes';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';
import { hullTypes, hullTypesAbb } from '../data/categories';
interface GridItemProps {
  index: number;
  ship?: Ship;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index, ship }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);

  const openShipSelector = () => {
    dispatch(formationModalAction(FormationModalAction.Open, true, index));
  };

  const getLocation = (idx: number): string => {
    switch (idx) {
      case 1:
        return 'Flagship';
      case 3:
        return 'Front';
      case 5:
        return 'Back';
      default:
        return '';
    }
  };

  return (
    <div className="grid-item">
      <div
        className={`content`}
        onClick={() => openShipSelector()}
        onContextMenu={() => dispatch(formationAction(FormationAction.RemoveShip, index))}
        data-tip
        data-for="click-help"
        data-delay-show="1000"
        data-background-color="var(--main-dark-tooltip-bg)"
        data-border
        data-border-color="var(--main-dark-tooltip-border)"
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
            <div className={`details`}>Add ship</div>
          </div>
        )}
        <div className={'pos-indicator'}>{getLocation(index)}</div>

        {/*
        <div className={`details`}>{ship !== undefined ? ship.names.en : 'Add ship'}</div>
        <div className={'footer-misc'}>
          <div
            className={`hull-type ${ship !== undefined && ship.hullType !== undefined ? hullTypes[ship.hullType] : ''}`}
          >
            {ship !== undefined && ship.hullType !== undefined ? hullTypesAbb[hullTypes[ship.hullType]] : ''}
          </div>
          <div className={'pos-indicator'}>{getLocation(index)}</div>
        </div>
        */}
      </div>
    </div>
  );
};

export default FormationGridItem;
