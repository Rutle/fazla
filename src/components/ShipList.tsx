import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import { getShipsSimple, ShipSimple, getShipById, Ship } from './util/shipdata';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setListState, setCurrentToggle } from '../reducers/slices/listStateSlice';
import { setOwnedSearchList } from '../reducers/slices/ownedSearchListSlice';
import { setSearchString } from '../reducers/slices/searchParametersSlice';
// import Menu from './Menu';
import Popover from 'react-tiny-popover';
// import ParameterPopover from './SearchParameterContent';
import SearchParameterContent from './SearchParameterContent';

const ShipList: React.FC = () => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const listState = useSelector((state: RootState) => state.listState);
  const ownedSearch = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  // const [selectedTab, setSelectedTab] = useState('Search');
  const [searchValue, setSearchValue] = useState(localStorage.getItem('searchValue') || '');
  const [inputFocus, setInputFocus] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [searchParam, setSearchParam] = useState('name');

  // Populate list
  useEffect(() => {
    try {
      const data: ShipSimple[] = getShipsSimple('');
      // const data: Ship[] = getShipsFull('');
      dispatch(setList(data));
      dispatch(setDetails(getShipById(data[0].id)));
      dispatch(setListState({ key: 'all', data: { id: data[0].id, index: 0 } }));
      // dispatch(setListState({ key: 'owned', data: { id: ownedList[0].id, index: 0 } }));
      dispatch(setOwnedSearchList(ownedList));
      dispatch(setDetails(getShipById(ownedList[0].id)));
      // setSelected(ownedList[0].id);
      dispatch(setListState({ key: 'owned', data: { id: ownedList[0].id, index: 0 } }));
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (listState.currentToggle) {
      case 'all':
        const t: ShipSimple[] = getShipsSimple(searchValue);
        // const t: Ship[] = getShipsFull(searchValue);
        dispatch(setDetails(getShipById(listState.all.id)));
        dispatch(setList(t));
        // dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
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
    console.log('search parameters changed', searchParameters.name);
    switch (listState.currentToggle) {
      case 'all':
        const t: ShipSimple[] = getShipsSimple(searchParameters.name);
        // const t: Ship[] = getShipsFull(searchValue);
        dispatch(setDetails(getShipById(t[0].id)));
        dispatch(setList(t));
        if (t.length === 0) return;
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
    event.preventDefault();
    switch (listState.currentToggle) {
      case 'all':
        const t: ShipSimple[] = getShipsSimple(searchValue);
        // const t: Ship[] = getShipsFull(searchValue);
        dispatch(setList(t));
        if (t.length === 0) return;
        dispatch(setListState({ key: 'all', data: { id: t[0].id, index: 0 } }));
        break;
      case 'owned':
        const d: ShipSimple[] = ownedList.filter(searchPredicate);
        dispatch(setOwnedSearchList(d));
        if (d.length === 0) return;
        dispatch(setListState({ key: 'owned', data: { id: d[0].id, index: 0 } }));
        break;
      default:
        break;
    }
  };
  const searchPredicate = (ele: ShipSimple) => {
    return ele.name.toLowerCase().includes(searchParameters.name.toLowerCase());
  };

  const hullPredicate = (ele: ShipSimple) => {
    /*
    if (searchParameters.hullType === '') {
      return true;
    }
    return ele.hullType?.toLowerCase() === searchParameters.hullType.toLowerCase();
    */
  };

  const nationalityPredicate = (ele: ShipSimple) => {
    /*
    if (searchParameters.nationality === '') {
      return true;
    }
    
    return ele.nationality?.toLowerCase() === searchParameters.nationality.toLowerCase();
    */
  };

  const rarityPredicate = (ele: ShipSimple) => {
    /*
    if (searchParameters.rarity === '') {
      return true;
    }
    return ele.rarity?.toLowerCase() === searchParameters.rarity.toLowerCase();
    */
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
                  {ship.name}
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
