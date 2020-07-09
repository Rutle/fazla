import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setList } from '../reducers/slices/shipListSlice';
import PageTemplate from './PageTemplate';
import { getShipsSimple, ShipDataSimple, ShipSimple, getShipById } from './util/shipdata';
import ShipDetails from './ShipDetails';
import { setDetails } from '../reducers/slices/shipDetailsSlice';

const ShipDetailView: React.FC = () => {
  const dispatch = useDispatch();
  const shipList = useSelector((state: RootState) => state.shipList);
  const config = useSelector((state: RootState) => state.config);

  const [selectedId, setSelected] = useState('');
  const [selectedTab, setSelectedTab] = useState('search');
  const [searchValue, setSearchValue] = useState(localStorage.getItem('searchValue') || '');

  // Populate list
  useEffect(() => {
    try {
      const data: ShipDataSimple = getShipsSimple(searchValue);
      dispatch(setList(data));
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Remember search value
  useEffect(() => {
    localStorage.setItem('searchValue', searchValue);
  }, [searchValue]);

  // Set the first item on the list as active when ship list is updated.
  useEffect(() => {
    try {
      if (shipList.ships.length > 0) {
        dispatch(setDetails(getShipById(shipList.ships[0].id)));
        setSelected(shipList.ships[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  }, [shipList]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    try {
      dispatch(setDetails(getShipById(id)));
      setSelected(id);
    } catch (err) {
      console.log(err);
    }
  };

  const searchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(searchValue);
    try {
      dispatch(setList(getShipsSimple(searchValue)));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <div id="ship-side-list">
          <div className="top-container">
            <div className="tab">
              <button
                className={`tab-btn ${selectedTab === 'search' ? 'active' : ''}`}
                onClick={() => setSelectedTab('search')}
              >
                Search
              </button>
              <button
                className={`tab-btn ${selectedTab === 'PH1' ? 'active' : ''}`}
                onClick={() => setSelectedTab('PH1')}
              >
                PH1
              </button>
              <button
                className={`tab-btn ${selectedTab === 'PH2' ? 'active' : ''}`}
                onClick={() => setSelectedTab('PH2')}
              >
                PH2
              </button>
            </div>
            <div id="search" className={`tab-content ${selectedTab === 'search' ? 'active' : 'hidden'}`}>
              <form onSubmit={(e) => searchSubmit(e)}>
                <input
                  id="search-input"
                  type="text"
                  className={`${config.themeColor}`}
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                />
              </form>
            </div>
            <div id="PH1" className={`tab-content ${selectedTab === 'PH1' ? 'active' : 'hidden'}`}>
              PH!
            </div>
            <div id="PH2" className={`tab-content ${selectedTab === 'PH2' ? 'active' : 'hidden'}`}>
              PH2
            </div>
          </div>
          <div className="rList">
            {shipList.ships.map((ship: ShipSimple) => {
              /*
              return (
                <li key={ship.id} className="rList-item" onClick={(e) => handleClick(e, ship.id)}>
                  {ship.names.code}
                </li>
              );
              */
              return (
                <button
                  key={ship.id}
                  className={`rList-item btn ${config.themeColor} ${ship.id === selectedId ? 'selected' : ''}`}
                  type="button"
                  onClick={(e) => handleClick(e, ship.id)}
                >
                  {ship.name}
                </button>
              );
            })}
          </div>
        </div>
        <div id="ship-data">
          <ShipDetails />
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
