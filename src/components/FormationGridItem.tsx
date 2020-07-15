import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setShip } from '../reducers/slices/formationGridSlice';
import { getShipById } from './util/shipdata';

interface GridItemProps {
  index: number;
}

// eslint-disable-next-line react/prop-types
const FormationGridItem: React.FC<GridItemProps> = ({ index }) => {
  const dispatch = useDispatch();
  const currentFormation = useSelector((state: RootState) => state.formationGrid);
  const listState = useSelector((state: RootState) => state.listState);
  const shipList = useSelector((state: RootState) => state.shipList);
  const config = useSelector((state: RootState) => state.config);

  const addShipToFormation = () => {
    switch (listState.currentToggle) {
      case 'all':
        const n: number = listState[listState.currentToggle].index;
        // dispatch(setShip({ index, data: shipList[n] }));
        dispatch(setShip({ index, data: getShipById(shipList[n].id) }));
        break;
      default:
        break;
    }
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

  useEffect(() => {
    console.log(index);
  }, []);

  const isSet = (): boolean => {
    return currentFormation[index] !== undefined;
  };

  return (
    <div className={`grid-item`}>
      {console.log(currentFormation[index] === undefined)}
      <button className={`btn ${config.themeColor}`} onClick={() => addShipToFormation()}>
        <div>Add selected ship</div>
      </button>
      <div className={`content ${config.themeColor}`}>
        <div className={`details ${config.themeColor} ${isSet() ? currentFormation[index].rarity : ''}`}>
          {isSet() ? currentFormation[index].names.en : 'Empty'}
        </div>
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
