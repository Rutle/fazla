import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import { getShipsSimple, ShipSimple, getShipById, Ship } from '../util/shipdata';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setListState, setCurrentToggle } from '../reducers/slices/listStateSlice';
import { setOwnedSearchList } from '../reducers/slices/ownedSearchListSlice';
import { setSearchString } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import { setFullList, initializeFullShipList } from '../reducers/slices/fullShipListSlice';

const ShipList: React.FC = () => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const listState = useSelector((state: RootState) => state.listState);
  const ownedSearch = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const fullShipList = useSelector((state: RootState) => state.fullList);
  const [searchValue, setSearchValue] = useState(searchParameters.name || '');
  const [inputFocus, setInputFocus] = useState(false);
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Populate list
  useEffect(() => {
    try {
      if (fullShipList.length === 0) {
        console.log('Full ship list was empty: ');
        const data: ShipSimple[] = getShipsSimple('');
        // dispatch(setFullList(data));
        dispatch(initializeFullShipList(data));
      }

      /*
      const dataList: ShipSimple[] = data.filter(fullPredicate);
      // const data: Ship[] = getShipsFull('');
      dispatch(setList(dataList));
      dispatch(setDetails(getShipById(dataList[0].id)));
      dispatch(setListState({ key: 'all', data: { id: dataList[0].id, index: 0 } }));
      // dispatch(setListState({ key: 'owned', data: { id: ownedList[0].id, index: 0 } }));
      dispatch(setOwnedSearchList(ownedList));
      dispatch(setDetails(getShipById(ownedList[0].id)));
      // setSelected(ownedList[0].id);
      dispatch(setListState({ key: 'owned', data: { id: ownedList[0].id, index: 0 } }));
      */
    } catch (e) {
      console.log(e);
    } finally {
      console.log(fullShipList.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (listState.currentToggle) {
      case 'all':
        // const t: ShipSimple[] = getShipsSimple(searchValue);
        // const t: Ship[] = getShipsFull(searchValue);
        console.log('listState.currentToggle ', fullShipList.length);
        const t: ShipSimple[] = fullShipList
          .filter(searchPredicate)
          .filter(rarityPredicate)
          .filter(nationalityPredicate)
          .filter(hullPredicate);
        if (t.length === 0 || t === undefined) {
          console.log(' listState.currentToggle no ships');
          return;
        }
        dispatch(setDetails(getShipById(listState.all.id)));
        dispatch(setList(t));
        dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
        break;
      case 'owned':
        const s: ShipSimple[] = ownedList.filter(searchPredicate);
        dispatch(setDetails(getShipById(listState.owned.id)));
        dispatch(setOwnedSearchList(s));
        // dispatch(setListState({ key: 'owned', data: { id: s[0].id, index: 0 } }));
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listState.currentToggle]);

  // Remember search value
  useEffect(() => {
    console.log('search parameters changed');
    console.log('[ ', searchParameters, ' ]');
    switch (listState.currentToggle) {
      case 'all':
        // const t: ShipSimple[] = getShipsSimple(searchParameters.name);
        // const t: Ship[] = getShipsFull(searchValue);
        // console.log("searchParameters ", fullShipList.length);
        const t: ShipSimple[] = fullShipList
          .filter(searchPredicate)
          .filter(rarityPredicate)
          .filter(nationalityPredicate)
          .filter(hullPredicate);
        if (t.length === 0 || t === undefined) {
          console.log('searchParameters no ships');
          return;
        }
        console.log('search result: ', t.length);
        dispatch(setDetails(getShipById(t[0].id)));
        dispatch(setList(t));
        dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
        break;
      case 'owned':
        const s: ShipSimple[] = ownedList.filter(searchPredicate);
        dispatch(setOwnedSearchList(s));
        if (s.length === 0) return;
        dispatch(setDetails(getShipById(s[0].id)));
        dispatch(setListState({ key: 'owned', data: { id: s[0].id, index: 0 } }));
        break;
      default:
        break;
    }
    // localStorage.setItem('searchValue', searchValue);
    // localStorage.setItem('listToggle', listToggle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters]);

  const searchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('searchSubmit', fullShipList.length);
    event.preventDefault();
    switch (listState.currentToggle) {
      case 'all':
        // const t: ShipSimple[] = getShipsSimple(searchValue);
        const t: ShipSimple[] = fullShipList
          .filter(searchPredicate)
          .filter(rarityPredicate)
          .filter(nationalityPredicate)
          .filter(hullPredicate);
        // const t: Ship[] = getShipsFull(searchValue);
        dispatch(setList(t));
        if (t.length === 0) return;
        dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
        break;
      case 'owned':
        const d: ShipSimple[] = ownedList
          .filter(searchPredicate)
          .filter(rarityPredicate)
          .filter(nationalityPredicate)
          .filter(hullPredicate);
        dispatch(setOwnedSearchList(d));
        if (d.length === 0) return;
        dispatch(setListState({ key: 'owned', data: { id: d[0].id, index: 0 } }));
        break;
      default:
        break;
    }
  };
  /*
  const fullPredicate = (ele: ShipSimple) => {
    // rarity = rare
    // nationality = none
    // hulltype = light cruiser
    //const isRar = Object.entries(searchParameters.rarity).
    //const isNat = false;
    //const isHull = false;
    if (ele.id === '100') {
      console.log(
        'Name: ',
        ele.name,
        ' vs search: ',
        searchParameters.name,
        ' state: ',
        ele.name.toLowerCase().includes(searchParameters.name.toLowerCase()),
      );
      console.log('rarity: ', ele.rarity, ' state: ', searchParameters.rarity[ele.rarity as string]);
      console.log(
        'nationality: ',
        ele.nationality,
        ' state: ',
        searchParameters.nationality[ele.nationality as string],
      );
      console.log('hull: ', ele.hullType, ' state: ', searchParameters.hullType[ele.hullType as string]);
    }
    if (
      searchParameters.rarity[ele.rarity as string] &&
      searchParameters.nationality[ele.nationality as string] &&
      searchParameters.hullType[ele.hullType as string] &&
      ele.name.toLowerCase().includes(searchParameters.name.toLowerCase())
    ) {
      console.log('fullPredicate');
      return true;
    }
    return false;

    // return ele.name.toLowerCase().includes(searchParameters.name.toLowerCase());
  };
  */
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    try {
      const ship: Ship = getShipById(id);
      let index = 0;
      if (listState.currentToggle === 'all') {
        index = shipList.findIndex((ship) => ship.id === id);
      }
      if (listState.currentToggle === 'owned') {
        index = ownedSearch.findIndex((ship) => ship.id === id);
      }
      dispatch(setDetails(ship));
      dispatch(setListState({ key: listState.currentToggle, data: { id: ship.id, index: index } }));
    } catch (err) {
      console.log(err);
    }
  };

  const renderList = () => {
    switch (listState.currentToggle) {
      case 'all':
        return (
          <div className={`rList`}>
            {shipList.map((ship: ShipSimple) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${
                    ship.id === listState[listState.currentToggle as string].id ? 'selected' : ''
                  }`}
                  type="button"
                  onClick={(e) => handleClick(e, ship.id)}
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
            {ownedSearch.map((ship: ShipSimple) => {
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${ship.id === listState.owned.id ? 'selected' : ''}`}
                  type="button"
                  onClick={(e) => handleClick(e, ship.id)}
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
              checked={listState.currentToggle === 'all'}
              onChange={() => dispatch(setCurrentToggle('all'))}
            />
            <label className={`toggle ${config.themeColor}`} htmlFor="all">
              All
            </label>
            <input
              id="owned"
              type="radio"
              value="false"
              checked={listState.currentToggle === 'owned'}
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
