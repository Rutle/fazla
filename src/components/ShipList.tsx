import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import { getShipsSimple, ShipDataSimple, ShipSimple, getShipById, Ship } from './util/shipdata';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setListState } from '../reducers/slices/listStateSlice';

const ShipList: React.FC<{
  listToggle: string;
  setListToggle: React.Dispatch<React.SetStateAction<string>>;
  // eslint-disable-next-line react/prop-types
}> = ({ listToggle, setListToggle }) => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const listState = useSelector((state: RootState) => state.listState);

  // const [selectedId, setSelected] = useState('');
  const [selectedTab, setSelectedTab] = useState('search');
  const [searchValue, setSearchValue] = useState(localStorage.getItem('searchValue') || '');
  const [inputFocus, setInputFocus] = useState(false);
  const [searchParam, setSearchParam] = useState('name');

  // Populate list
  useEffect(() => {
    try {
      const data: ShipDataSimple = getShipsSimple('');
      dispatch(setList(data));
      dispatch(setDetails(getShipById(data.ships[0].id)));
      // setSelected(shipList.ships[0].id);
      dispatch(setListState({ key: 'all', data: { id: data.ships[0].id, index: 0 } }));
      dispatch(setDetails(getShipById(ownedList[0].id)));
      // setSelected(ownedList[0].id);
      dispatch(setListState({ key: 'owned', data: { id: ownedList[0].id, index: 0 } }));
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    switch (listToggle) {
      case 'all':
        dispatch(setDetails(getShipById(listState.all.id)));
        break;
      case 'owned':
        dispatch(setDetails(getShipById(listState.owned.id)));
        break;
      default:
        break;
    }
  }, [listToggle]);

  // Remember search value
  useEffect(() => {
    localStorage.setItem('searchValue', searchValue);
    localStorage.setItem('listToggle', listToggle);
  }, [searchValue]);

  const searchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (listToggle) {
      case 'all':
        dispatch(setList(getShipsSimple(searchValue)));
        break;
      case 'owned':
        dispatch(setList(getShipsSimple(searchValue)));
        break;
      default:
        break;
    }
    try {
      dispatch(setList(getShipsSimple(searchValue)));
    } catch (err) {
      console.log(err);
    }
  };
  const searchPredicate = (ele: ShipSimple) => {
    switch (searchParam) {
      case 'name':
        return ele.name.toLowerCase().includes(searchValue.toLowerCase());
      default:
        break;
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    try {
      const ship: Ship = getShipById(id);
      let index = 0;
      if (listToggle === 'all') {
        index = shipList.ships.findIndex((ship) => ship.id === id);
        console.log(index);
      }
      if (listToggle === 'owned') {
        index = ownedList.findIndex((ship) => ship.id === id);
      }
      dispatch(setDetails(ship));
      // setSelected(id);
      dispatch(setListState({ key: listToggle, data: { id: ship.id, index: index } }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="ship-side-list">
      <div className="top-container">
        <div className="tab">
          <button
            className={`tab-btn ${selectedTab === 'search' ? 'active' : ''}`}
            onClick={() => setSelectedTab('search')}
          >
            Search
          </button>
          <button className={`tab-btn ${selectedTab === 'PH1' ? 'active' : ''}`} onClick={() => setSelectedTab('PH1')}>
            PH1
          </button>
          <button className={`tab-btn ${selectedTab === 'PH2' ? 'active' : ''}`} onClick={() => setSelectedTab('PH2')}>
            PH2
          </button>
        </div>
        <div id="search" className={`tab-content ${selectedTab === 'search' ? 'active' : 'hidden'}`}>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
              />
            </div>
            <div className={`radio-group`}>
              <input
                id="all"
                type="radio"
                value="all"
                checked={listToggle === 'all'}
                onChange={() => setListToggle('all')}
              />
              <label className={`${config.themeColor}`} htmlFor="all">
                All
              </label>
              <input
                id="owned"
                type="radio"
                value="false"
                checked={listToggle === 'owned'}
                onChange={() => setListToggle('owned')}
              />
              <label className={`${config.themeColor}`} htmlFor="owned">
                Owned
              </label>
            </div>
          </form>
        </div>
        <div id="PH1" className={`tab-content ${selectedTab === 'PH1' ? 'active' : 'hidden'}`}>
          PH!
        </div>
        <div id="PH2" className={`tab-content ${selectedTab === 'PH2' ? 'active' : 'hidden'}`}>
          PH2
        </div>
      </div>
      <div className={`rList ${listToggle === 'all' ? 'active' : 'hidden'}`}>
        {shipList.ships.map((ship: ShipSimple) => {
          return (
            <button
              key={ship.id}
              className={`rList-item btn ${config.themeColor} ${ship.id === listState.all.id ? 'selected' : ''}`}
              type="button"
              onClick={(e) => handleClick(e, ship.id)}
            >
              {ship.name}
            </button>
          );
        })}
      </div>
      <div className={`rList ${listToggle === 'owned' ? 'active' : 'hidden'}`}>
        {
          /*ownedList.map((ship: ShipSimple) => {
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
        })*/
          ownedList.filter(searchPredicate).map((ship: ShipSimple) => {
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
          })
        }
      </div>
    </div>
  );
};

export default ShipList;
