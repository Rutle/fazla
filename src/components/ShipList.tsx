/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import {
  setSelectedShip,
  updateOwnedSearchList,
} from '../reducers/slices/appStateSlice';
import DataStore from '../util/dataStore';
import { ShipSimple } from '../util/shipdatatypes';

interface ShipListProps {
  shipData: DataStore;
  shipSearchList: ShipSimple[];
  listName: string;
}
const ShipList: React.FC<ShipListProps> = ({ shipData, shipSearchList, listName }) => {
  const dispatch = useDispatch();
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  // const [searchValue, setSearchValue] = useState(searchParameters.name);
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    console.log('[ShipList] [', listName, ']');
  }, []);

  /*
  const renderList = () => {
    switch (appState.cToggle) {
      case 'all':
        return (
          <div className={`rList`}>
            {shipSearchList.map((ship, index) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${
                    ship.id === appState[appState.cToggle as string].id ? 'selected' : ''
                  }`}
                  type="button"
                  // onClick={(e) => selectShip(e, index, ship.id)}
                  onClick={() => dispatch(setSelectedShip(appState.cToggle, ship.id, index))}
                >
                  {`${shipData.shipsArr[ship.index].names.en}`}
                </button>
              );
            })}
          </div>
        );
      case 'owned':
        return (
          <div className={`rList`}>
            {ownedSearchList.map((ship, index) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${ship.id === appState.owned.id ? 'selected' : ''}`}
                  type="button"
                  // onClick={(e) => selectShip(e, index, ship.id)}
                  onClick={() => dispatch(setSelectedShip(appState.cToggle, ship.id, index))}
                >
                  {shipData.shipsArr[ship.index].names.en}
                </button>
              );
            })}
          </div>
        );
      default:
        break;
    }
  };
  */
  return (
    <div className={`rList ${listName !== appState.cToggle ? 'hidden' : ''}`}>
      {shipSearchList.map((ship, index) => {
        return (
          <button
            key={ship.id}
            className={`rList-item btn ${config.themeColor} ${
              ship.id === appState[appState.cToggle as string].id ? 'selected' : ''
            }`}
            type="button"
            onClick={() => dispatch(setSelectedShip(appState.cToggle, ship.id, index))}
          >
            {`${shipData.shipsArr[ship.index].names.en}`}
          </button>
        );
      })}
    </div>
  );
};

export default ShipList;
