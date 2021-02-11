import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { RootState } from '_/reducers/rootReducer';
import { Ship, ShipSimple } from '_/utils/types';
import { setSelectedShip } from '_/reducers/slices/appStateSlice';
import { AppContext } from '_/App';
import { hullTypes, hullTypesAbb } from '../data/categories';

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
  const ownedShips = useSelector((state: RootState) => state.ownedShips);

  const selectShip = useCallback(
    (id: string, index: number) => {
      dispatch(setSelectedShip(appState.cToggle, id, index));
    },
    [appState.cToggle, dispatch]
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

  const isOwned = useCallback(
    (id: string): boolean => {
      if (listName === 'OWNED') return false;
      return ownedShips.includes(id);
    },
    [listName, ownedShips]
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
            {React.memo(({ index, style }) => {
              const ship = shipData.shipsArr[shipSearchList[index].index];
              const isShipOwned = isOwned(ship.id);
              return (
                <button
                  type="button"
                  style={{ ...style, top: (style.top as number) + 1, height: 29, width: 'calc(100% - 1px)' }}
                  className={`rList-item btn ${config.themeColor} ${isShipOwned ? 'owned' : ''} ${
                    shipSearchList[index].id === appState[appState.cToggle].id ? 'selected' : ''
                  }`}
                  onClick={() => selectShip(shipSearchList[index].id, shipSearchList[index].index)}
                >
                  <div className="owned-indicator" />
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
