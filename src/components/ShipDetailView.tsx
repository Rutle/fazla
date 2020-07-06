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

  const [selectedId, setSelected] = useState('');
  const [selectedTab, setSelectedTab] = useState('search');

  useEffect(() => {
    // console.log('useEffect', getShips('KMS'));
    try {
      // const data: ShipData = getShips('KMS');
      const data: ShipDataSimple = getShipsSimple('KMS');
      // console.log('shipData', data.ships.length);
      dispatch(setList(data));
    } catch (e) {
      console.log(e);
    }
  }, []);

  // Set the first item on the list as active when ship list is updated.
  useEffect(() => {
    console.log('Shiplist', selectedId);
    try {
      if (shipList.ships.length > 0) {
        // console.log('>0');
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

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <div id="ship-side-list">
          <div className="top-container">
            <div className="tab">
              <button
                className={`tab-content ${selectedTab === 'search' ? 'active' : ''}`}
                onClick={() => setSelectedTab('search')}
              >
                Search
              </button>
              <button
                className={`tab-content ${selectedTab === 'PH1' ? 'active' : ''}`}
                onClick={() => setSelectedTab('PH1')}
              >
                PH1
              </button>
              <button
                className={`tab-content ${selectedTab === 'PH2' ? 'active' : ''}`}
                onClick={() => setSelectedTab('PH2')}
              >
                PH2
              </button>
            </div>
            <div id="search" className={`tab-content ${selectedTab === 'search' ? 'active' : 'hidden'}`}>
              Search
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
                  // className="rList-item btn-rList"
                  className={`rList-item btn-rList ${ship.id === selectedId ? 'btn-selected' : ''}`}
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
