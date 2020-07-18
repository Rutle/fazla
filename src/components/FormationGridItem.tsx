import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
// import { setShip } from '../reducers/slices/formationGridSlice';
// import { getShipById } from './util/shipdata';
import { openModal } from '../reducers/slices/formationModalSlice';

interface GridItemProps {
  index: number;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index }) => {
  const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  // const listState = useSelector((state: RootState) => state.listState);
  // const shipList = useSelector((state: RootState) => state.shipList);
  const config = useSelector((state: RootState) => state.config);
  // const ownedSearch = useSelector((state: RootState) => state.ownedSearchList);
  // const formationModal = useSelector((state: RootState) => state.formationModal);
  /*
  const addShipToFormation = () => {
    // dispatch(setModalState(true));
    const n: number = listState[listState.currentToggle].index;
    switch (listState.currentToggle) {
      case 'all':
        // dispatch(setShip({ index, data: shipList[n] }));
        dispatch(setShip({ index, data: getShipById(shipList[n].id) }));
        break;
      case 'owned':
        dispatch(setShip({ index, data: getShipById(ownedSearch[n].id) }));
        break;
      default:
        break;
    }
  };
*/
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
  index: PropTypes.string.isRequired,
};
*/
