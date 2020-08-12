/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { openModal } from '../reducers/slices/formationModalSlice';
import { Ship } from '../util/shipdatatypes';
import PropTypes from 'prop-types';

interface GridItemProps {
  index: number;
  ship: Ship | undefined;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index, ship }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);

  const openShipSelector = () => {
    dispatch(openModal({ isOpen: true, gridIndex: index }));
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

  const isSet = (): boolean => {
    return ship !== undefined;
    // return currentFormation[index] !== undefined;
  };

  return (
    <div className={`grid-item ${config.themeColor}`}>
      <button className={`btn ${config.themeColor}`} onClick={() => openShipSelector()}>
        <div>Add ship</div>
      </button>
      <div className={`content ${ship !== undefined ? ship.rarity : ''}`}>
        <div className={`details`}>{ship !== undefined ? ship.names.en : 'Empty'}</div>
        <div className={'footer-misc'}>
          <div className={'pos-indicator'}>{getLocation(index)}</div>
          <div className={`hull-type ${ship !== undefined ? ship.hullType : ''}`}>
            {ship !== undefined ? ship.hullType : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationGridItem;
/*
FormationGridItem.propTypes = {
  ship: PropTypes.object,
};
*/