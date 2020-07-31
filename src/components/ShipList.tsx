import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { getShipsSimple, getShipById } from '../util/appUtilities';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  setCurrentToggle,
  setSelectedShip,
  setSearchResults,
  initShipLists,
  initListState,
} from '../reducers/slices/listStateSlice';
import { setSearchString } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import { ShipSimple } from '../util/shipdatatypes';

const ShipList: React.FC = () => {
  const dispatch = useDispatch();
  // const appState = useSelector((state: RootState) => state.appState);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const listState = useSelector((state: RootState) => state.listState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const fullShipList = useSelector((state: RootState) => state.fullList);
  const [searchValue, setSearchValue] = useState(searchParameters.name || '');
  const [inputFocus, setInputFocus] = useState(false);

  // Initialize ship state, lists and etc.
  useEffect(() => {
    try {
      if (fullShipList.length === 0) {
        console.log('[INIT] {1}: Initialize full ship list');
        // const data: ShipSimple[] = getShipsSimple('');
        // dispatch(initShipLists(data, ownedList));
        dispatch(initShipLists());
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Catch when the search list of ships is being modified.
  // INIT:    First time updated.
  //          Set initial list states and select ship as well as modify state to 'RUNNING'.
  // RUNNING:
  useEffect(() => {
    if (listState.cState === 'INIT') {
      if (shipSearchList.length !== 0) {
        console.log('[INIT] {2}: Set initial lists states after Init {1}.');
        dispatch(
          initListState('all', 0, shipSearchList[0].id, 'owned', 0, ownedSearchList[0].id, listState.useTempData),
        );
      } else {
        console.log(
          '[INIT] {1}: and shipSearchList length: [',
          shipSearchList.length,
          ']: Ship data has not been set in search list yet.',
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipSearchList]);

  // Set details of the selected ship when changed between 'all ships' and 'owned ships'.
  useEffect(() => {
    if (listState.cState === 'INIT') return;
    const { cToggle } = listState;
    console.log('Toggle: [', cToggle, ']', listState[cToggle]);
    dispatch(setDetails(getShipById(listState[cToggle].id, listState.useTempData)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState.cToggle]);

  // Update lists when search parameter changes.
  useEffect(() => {
    if (listState.cState === 'INIT') {
      console.log('[INIT] {1}: ship lists are not setup for searching yet. Skipping.');
      return;
    }
    const allS: ShipSimple[] = getSearchList(fullShipList);
    const ownedS: ShipSimple[] = getSearchList(ownedList);
    dispatch(setSearchResults(allS, ownedS, listState.cToggle, listState.useTempData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters]);

  const getSearchList = (list: ShipSimple[]): ShipSimple[] => {
    return list.filter(searchPredicate).filter(rarityPredicate).filter(nationalityPredicate).filter(hullPredicate);
  };

  const searchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
    switch (listState.cToggle) {
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
      if (listState.cToggle === 'all') {
        index = shipSearchList.findIndex((ship) => ship.id === id);
      }
      if (listState.cToggle === 'owned') {
        index = ownedSearchList.findIndex((ship) => ship.id === id);
      }
      dispatch(setSelectedShip(listState.cToggle, index, id, listState.useTempData));
    } catch (err) {
      console.log(err);
    }
  };

  const renderList = () => {
    switch (listState.cToggle) {
      case 'all':
        return (
          <div className={`rList`}>
            {shipSearchList.map((ship: ShipSimple) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${
                    ship.id === listState[listState.cToggle as string].id ? 'selected' : ''
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
                  className={`rList-item btn ${config.themeColor} ${ship.id === listState.owned.id ? 'selected' : ''}`}
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
              checked={listState.cToggle === 'all'}
              onChange={() => dispatch(setCurrentToggle('all'))}
            />
            <label className={`toggle ${config.themeColor}`} htmlFor="all">
              All
            </label>
            <input
              id="owned"
              type="radio"
              value="false"
              checked={listState.cToggle === 'owned'}
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
