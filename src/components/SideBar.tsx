/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  setCurrentToggle,
  updateOwnedSearchList,
  setSearchResults,
  setSelectedShip,
} from '../reducers/slices/appStateSlice';
import { setSearchString } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import DataStore from '../util/dataStore';
import ShipList from './ShipList';

interface ShipListProps {
  shipData: DataStore;
}
const SideBar: React.FC<ShipListProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const [searchValue, setSearchValue] = useState(searchParameters.name);
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    console.log('[SideBar]');
  }, []);

  // Set details of the selected ship when changed between 'all ships' and 'owned ships'.
  useEffect(() => {
    const { cToggle } = appState;
    if (appState.cState === 'INIT') return;

    console.log('toggle', appState[appState.cToggle]);
    dispatch(setDetails({ id: appState[cToggle].id, index: appState[cToggle].index }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cToggle]);

  // Update lists when search parameter changes.
  useEffect(() => {
    console.log('[searchParameters]: ', appState.cState, appState.cToggle, appState.cPage);
    if (appState.cState === 'INIT') {
      console.log('[INIT] {1}: ship lists are not setup for searching yet. Skipping.');
    } else if (appState.cPage === 'LIST') {
      console.log('LIST -> update search results');
      dispatch(setSearchResults(shipData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters]);

  useEffect(() => {
    if (appState.cState !== 'INIT' && appState.cToggle === 'all' && appState.cPage === 'LIST') {
      console.log('ownedSearchList muuttu: ', ownedSearchList);
      // dispatch(updateSearchList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedSearchList]);

  useEffect(() => {
    if (appState.cState !== 'INIT' && appState.cToggle === 'all' && appState.cPage === 'LIST') {
      console.log('shipSearchList muuttu: ', shipSearchList[0]);
      // dispatch(updateSearchList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipSearchList]);

  useEffect(() => {
    if (appState.cState !== 'INIT' && appState.cPage === 'LIST') {
      console.log('owned list muuttu - ollaan LIST sivulla -> lisattiin/poistettiin. NOT INIT');
      dispatch(updateOwnedSearchList(shipData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedList]);

  const searchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
    switch (appState.cToggle) {
      case 'all':
        const t: ShipSimple[] = getSearchList(fullShipList);
        dispatch(setList(t));
        if (t.length === 0) {
          dispatch(resetDetails());
          return;
        }
        dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
        break;
      case 'owned':
        const d: ShipSimple[] = getSearchList(ownedList);
        dispatch(setOwnedSearchList(d));
        if (d.length === 0) {
          dispatch(resetDetails());
          return;
        }
        dispatch(setListState({ key: 'owned', data: { id: d[0].id, index: 0 } }));
        break;
      default:
        break;
    }
     */
  };
  const selectShip = useCallback(
    (id: string, index: number) => {
      dispatch(setSelectedShip(appState.cToggle, id, index));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParameters, appState.cToggle],
  );

  return (
    <div className="ship-side-container dark">
      <div className="top-container">
        <CategoryOverlay />
        <form onSubmit={(e) => searchSubmit(e)}>
          <div id="input-group">
            <div className={`searchIcon ${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              id="search-input"
              type="text"
              className={`${config.themeColor}`}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                dispatch(setSearchString({ str: e.target.value }));
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
          </div>
          <div className={`radio-group`}>
            <input
              id="all"
              type="radio"
              value="all"
              checked={appState.cToggle === 'all'}
              onChange={() => dispatch(setCurrentToggle('all'))}
            />
            <label className={`toggle ${config.themeColor}`} htmlFor="all">
              All
            </label>
            <input
              id="owned"
              type="radio"
              value="false"
              checked={appState.cToggle === 'owned'}
              onChange={() => dispatch(setCurrentToggle('owned'))}
            />
            <label className={`toggle ${config.themeColor}`} htmlFor="owned">
              Owned
            </label>
          </div>
        </form>
      </div>
      <ShipList shipData={shipData} shipSearchList={shipSearchList} listName={'all'} onClick={selectShip} />
      <ShipList shipData={shipData} shipSearchList={ownedSearchList} listName={'owned'} onClick={selectShip} />
    </div>
  );
};

export default SideBar;
