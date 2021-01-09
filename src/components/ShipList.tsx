/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Ship, ShipSimple } from '../utils/shipdatatypes';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { setSelectedShip } from '../reducers/slices/appStateSlice';
import { hullTypes, hullTypesAbb } from '../data/categories';
import { AppContext } from '../App';

interface ShipListProps {
  shipSearchList: ShipSimple[];
  listName: string;
}
/**
 * Component for a list of ships.
 */
const ShipList: React.FC<ShipListProps> = ({ shipSearchList, listName }) => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);

  const selectShip = useCallback(
    (id: string, index: number) => {
      dispatch(setSelectedShip(appState.cToggle, id, index));
    },
    [appState.cToggle, dispatch],
  );

  const getHullTypeAbb = (hullType: string | undefined) => {
    if (!hullType) return '-';
    return hullTypesAbb[hullTypes[hullType]];
  };

  const getHullType = (ship: Ship | undefined) => {
    if (ship && ship.hullType) return hullTypes[ship.hullType];
    return '';
  };

  const getRarity = (ship: Ship | undefined) => {
    if (ship && ship.rarity) return ship.rarity;
    return '';
  };

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
            {React.memo(({ index, style }) => {
              const ship = shipData.shipsArr[shipSearchList[index].index];
              return (
                <button
                  style={{ ...style, top: (style.top as number) + 1, height: 29, width: 'calc(100% - 1px)' }}
                  className={`rList-item btn flat ${config.themeColor} ${
                    shipSearchList[index].id === appState[appState.cToggle].id ? 'selected' : ''
                  }`}
                  onClick={() => selectShip(shipSearchList[index].id, shipSearchList[index].index)}
                >
                  <div className={`name ${getRarity(ship)}`}>{ship.names.en}</div>
                  <div className={`hullTypeAbb ${getHullType(ship)}`}>{getHullTypeAbb(ship.hullType)}</div>
                </button>
              );
            })}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default ShipList;
