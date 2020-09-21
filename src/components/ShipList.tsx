/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import DataStore from '../util/dataStore';
import { ShipSimple } from '../util/shipdatatypes';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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

  const selectShip = useCallback(
    (id: string, index: number) => {
      dispatch(setSelectedShip(appState.cToggle, id, index));
    },
    [appState.cToggle, dispatch],
  );

  return (
    <div className={`rList${listName !== appState.cToggle ? ' hidden' : ''}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={shipSearchList.length}
            itemSize={30}
            width={width}
            style={{ overflowY: 'scroll' }}
          >
            {React.memo(({ index, style }) => (
              <button
                style={style}
                className={`rList-item btn flat ${config.themeColor} ${
                  shipSearchList[index].id === appState[appState.cToggle].id ? 'selected' : ''
                }`}
                onClick={() => selectShip(shipSearchList[index].id, shipSearchList[index].index)}
              >
                {shipData.shipsArr[shipSearchList[index].index].names.en}
              </button>
            ))}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default ShipList;
