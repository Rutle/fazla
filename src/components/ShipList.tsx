import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { RootState } from '_/reducers/rootReducer';
import { ShipSimple } from '_/types/types';
import { setSelectedShip } from '_/reducers/slices/appStateSlice';
import { AppContext } from '_/App';
import { getFleet, getHullTypeAbb } from '_/utils/appUtilities';
import { Ship } from '_/types/shipTypes';

interface ShipListProps {
  shipSearchList: ShipSimple[];
  listName: string;
  refe?: React.RefObject<HTMLDivElement>;
  scrollTo?: () => void;
  isDraggable?: boolean;
}
/**
 * Component for a list of ships.
 */
const ShipList: React.FC<ShipListProps> = ({ shipSearchList, listName, refe, scrollTo, isDraggable = false }) => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const selectShip = useCallback(
    (id: string, index: number) => {
      dispatch(setSelectedShip(appState.cToggle, id, index));
      if (scrollTo) {
        scrollTo();
      }
    },
    [appState.cToggle, dispatch, scrollTo]
  );

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
  const onDragStartFunc = (event: React.DragEvent<HTMLElement>) => (id: string, hull: string) => {
    event.stopPropagation();
    event.dataTransfer.clearData();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';
    const hullType = getFleet({ hullType: hull });
    event.dataTransfer.setData(
      hullType,
      JSON.stringify({
        'grid-index': 'none',
        'ship-id': id,
        'transfer-type': 'insert',
        hullType: 'fleet',
      })
    );
    event.currentTarget.classList.add('dragged');
  };
  const onDragEndFunc = (event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.classList.remove('dragged');
    if (event.currentTarget) event.currentTarget.blur();
  };
  return (
    <div className={`rList${listName !== appState.cToggle ? ' hidden' : ''}`}>
      <AutoSizer defaultHeight={(refe?.current?.scrollHeight as number) - 94}>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={shipSearchList.length}
            itemSize={30}
            width={width}
            style={{ overflowY: 'scroll' }}
          >
            {React.memo(({ index, style }) => {
              const ship = shipData.getShips()[shipSearchList[index].index];
              const isShipOwned = isOwned(ship.id);
              return (
                <button
                  type="button"
                  draggable={isDraggable}
                  style={{ ...style, top: (style.top as number) + 1, height: 29, width: 'calc(100% - 1px)' }}
                  className={`rList-item btn ${config.themeColor} ${isShipOwned ? 'owned' : ''} ${
                    shipSearchList[index].id === appState[appState.cToggle].id ? 'selected' : ''
                  }`}
                  onClick={() => selectShip(shipSearchList[index].id, shipSearchList[index].index)}
                  onDragStart={isDraggable ? (e) => onDragStartFunc(e)(ship.id, ship.hullType || 'none') : undefined}
                  onDragEnd={isDraggable ? onDragEndFunc : undefined}
                >
                  <div className="owned-indicator" />
                  <div className={`name ${getRarity(ship)}`}>{ship.names.en}</div>
                  <div className={`hulltype ${ship.hullType || 'none'}`}>{getHullTypeAbb(ship.hullType)}</div>
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
