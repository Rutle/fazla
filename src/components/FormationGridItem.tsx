import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setShip } from '../reducers/slices/formationGridSlice';
import { ShipSimple } from './util/shipdata';

interface GridItemProps {
  index: number;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index }) => {
  const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  const listState = useSelector((state:RootState) => state.listState);
  const shipList = useSelector((state: RootState) => state.shipList);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);

  const addShipToFormation = () => {
    switch (listState.currentToggle) {
      case 'all':
        const n: number = listState[listState.currentToggle].index;
        dispatch(setShip({ index, data: shipList[n] }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={'grid-item'}>
      <button className={'btn'} onClick={() => addShipToFormation()}>
        <div>Add selected ship</div>
      </button>
      <div className={'content'}>{currentFormation[index].name === '' ? 'Empty' : currentFormation[index].name}</div>
    </div>
  );
};

export default FormationGridItem;
/*
FormationGridItem.propTypes = {
  index: PropTypes.string.isRequired,
};
*/
