import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { openModal } from '../reducers/slices/formationModalSlice';

interface GridItemProps {
  index: number;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index }) => {
  const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
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
    return currentFormation[index] !== undefined;
  };

  return (
    <div className={`grid-item ${config.themeColor}`}>
      <button className={`btn ${config.themeColor}`} onClick={() => openShipSelector()}>
        <div>Add ship</div>
      </button>
      <div className={`content ${isSet() ? currentFormation[index].rarity : ''}`}>
        <div className={`details`}>{isSet() ? currentFormation[index].names.en : 'Empty'}</div>
        <div className={'footer-misc'}>
          <div className={'pos-indicator'}>{getLocation(index)}</div>
          <div className={`hull-type ${isSet() ? currentFormation[index].hullType : ''}`}>
            {isSet() ? currentFormation[index].hullType : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationGridItem;
/*
FormationGridItem.propTypes = {
  index: PropTypes.number.isRequired,
};
*/
