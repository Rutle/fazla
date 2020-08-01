import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { getShipById } from '../util/appUtilities';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setCurrentToggle, setSelectedShip, setSearchResults, updateOwnedSearchList } from '../reducers/slices/appStateSlice';
import { setSearchString } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import { ShipSimple } from '../util/shipdatatypes';

const ShipList: React.FC = () => {
  const dispatch = useDispatch();
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const fullShipList = useSelector((state: RootState) => state.fullList);
  const [searchValue, setSearchValue] = useState(searchParameters.name || '');
  const [inputFocus, setInputFocus] = useState(false);

  // Set details of the selected ship when changed between 'all ships' and 'owned ships'.
  useEffect(() => {
    if (appState.cState === 'INIT') return;
    const { cToggle } = appState;
    console.log('Toggle: [', cToggle, ']', appState[cToggle]);
    console.log(ownedList.length);
    dispatch(setDetails(getShipById(appState[cToggle].id, appState.useTempData)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cToggle]);

  // Update lists when search parameter changes.
  useEffect(() => {
    if (appState.cState === 'INIT') {
      console.log('[INIT] {1}: ship lists are not setup for searching yet. Skipping.');
      return;
    }
    const allS: ShipSimple[] = getSearchList(fullShipList);
    const ownedS: ShipSimple[] = getSearchList(ownedList);
    dispatch(setSearchResults(allS, ownedS, appState.cToggle, appState.useTempData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters]);

  const getSearchList = (list: ShipSimple[]): ShipSimple[] => {
    return list.filter(searchPredicate).filter(rarityPredicate).filter(nationalityPredicate).filter(hullPredicate);
  };

  useEffect(() => {
    if (appState.cState !== 'INIT') {
      console.log('owned list muuttu');
      // dispatch(setSearchResults(fullShipList, ownedList, appState.cToggle, appState.useTempData));
      const ownedS: ShipSimple[] = getSearchList(ownedList);
      dispatch(updateOwnedSearchList(ownedS));
    }
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

  const searchPredicate = (ele: ShipSimple) => {
    return ele.name.toLowerCase().includes(searchParameters.name.toLowerCase());
  };

  const hullPredicate = (ele: ShipSimple) => {
    if (searchParameters.hullTypeArr.length === 0) {
      return true;
    }
    return searchParameters.hullType[ele.hullType as string];
  };

  const nationalityPredicate = (ele: ShipSimple) => {
    if (searchParameters.nationalityArr.length === 0) {
      return true;
    }
    return searchParameters.nationality[ele.nationality as string];
  };

  const rarityPredicate = (ele: ShipSimple) => {
    if (searchParameters.rarityArr.length === 0) {
      return true;
    }
    return searchParameters.rarity[ele.rarity as string];
  };

  const selectShip = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    try {
      let index = 0;
      if (appState.cToggle === 'all') {
        index = shipSearchList.findIndex((ship) => ship.id === id);
      }
      if (appState.cToggle === 'owned') {
        index = ownedSearchList.findIndex((ship) => ship.id === id);
      }
      dispatch(setSelectedShip(appState.cToggle, index, id, appState.useTempData));
    } catch (err) {
      console.log(err);
    }
  };

  const renderList = () => {
    switch (appState.cToggle) {
      case 'all':
        return (
          <div className={`rList`}>
            {shipSearchList.map((ship: ShipSimple) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${
                    ship.id === appState[appState.cToggle as string].id ? 'selected' : ''
                  }`}
                  type="button"
                  onClick={(e) => selectShip(e, ship.id)}
                >
                  {`${ship.name}`}
                </button>
              );
            })}
          </div>
        );
      case 'owned':
        return (
          <div className={`rList`}>
            {ownedSearchList.map((ship: ShipSimple) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${ship.id === appState.owned.id ? 'selected' : ''}`}
                  type="button"
                  onClick={(e) => selectShip(e, ship.id)}
                >
                  {ship.name}
                </button>
              );
            })}
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className="ship-side-container dark">
      <div className="top-container">
        {/* <Menu setActiveTab={setSelectedTab} currentActiveTab={selectedTab} tabs={['Search', 'PH1', 'PH2']} /> */}
        {/*
        <Popover
          isOpen={isPopoverOpen}
          position={'bottom'} // preferred position
          onClickOutside={() => setIsPopoverOpen(false)}
          content={<SearchParameterContent />}
          containerClassName={'popover-container dark'}
        >
          <button className="btn small dark" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
            Categories
          </button>
        </Popover>
        */}
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
      {renderList()}
    </div>
  );
};

export default ShipList;
