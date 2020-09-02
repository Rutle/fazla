/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import DataStore from '../util/dataStore';
import { ShipSimple } from '../util/shipdatatypes';

interface ShipListProps {
  shipData: DataStore;
  shipSearchList: ShipSimple[];
  listName: string;
  onClick(id: string, index: number): void;
}
const ShipList: React.FC<ShipListProps> = ({ shipData, shipSearchList, listName, onClick }) => {
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
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
            onClick={() => onClick(ship.id, ship.index)}
          >
            {`${shipData.shipsArr[ship.index].names.en}`}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(ShipList);
