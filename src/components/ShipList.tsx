/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import DataStore from '../util/dataStore';
import { ShipSimple } from '../util/shipdatatypes';
import { setSelectedShip } from '../reducers/slices/appStateSlice';

interface ShipListProps {
  shipData: DataStore;
  shipSearchList: ShipSimple[];
  listName: string;
}
const ShipList: React.FC<ShipListProps> = ({ shipData, shipSearchList, listName }) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    console.log('[ShipList] [', shipSearchList.length, ']');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`rList ${listName !== appState.cToggle ? 'hidden' : ''}`}>
      {shipSearchList.map((ship) => {
        return (
          <button
            key={ship.id}
            className={`rList-item btn ${config.themeColor} ${
              ship.id === appState[appState.cToggle as string].id ? 'selected' : ''
            }`}
            type="button"
            onClick={() => {
              dispatch(setSelectedShip(appState.cToggle, ship.id, ship.index));
              console.log('ship id ', ship.id, ' index: ', ship.index);
            }}
          >
            {`${shipData.shipsArr[ship.index].names.en}`}
          </button>
        );
      })}
    </div>
  );
};

export default ShipList;
