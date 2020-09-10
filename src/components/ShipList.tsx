/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import DataStore from '../util/dataStore';
import { ShipSimple } from '../util/shipdatatypes';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface ShipListProps {
  shipData: DataStore;
  shipSearchList: ShipSimple[];
  listName: string;
  onClick(id: string, index: number): void;
}

const ShipList: React.FC<ShipListProps> = ({ shipData, shipSearchList, listName, onClick }) => {
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);

  /*
  return listName !== 'test' ? (
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
  ) : (
    */
  return (
    <div className={`rList${listName !== appState.cToggle ? ' hidden' : ''}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List height={height} itemCount={shipSearchList.length} itemSize={36} width={width}>
            {({ index, style }) => (
              <button
                type="button"
                style={style}
                className={`rList-item btn ${config.themeColor} ${
                  shipSearchList[index].id === appState[appState.cToggle as string].id ? 'selected' : ''
                }`}
                onClick={() => onClick(shipSearchList[index].id, shipSearchList[index].index)}
              >
                {shipData.shipsArr[shipSearchList[index].index].names.en}
              </button>
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(ShipList);
