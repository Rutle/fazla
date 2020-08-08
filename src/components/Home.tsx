import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { updateShipData, initShipLists, setCurrentPage } from '../reducers/slices/appStateSlice';
import { initData } from '../util/appUtilities';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';

interface HomeProps {
  shipData: DataStore;
}

const Home: React.FC<HomeProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const [shipCount, setShipCount] = useState(shipData.count);
  const [docksCount, setDocksCount] = useState(0);

  useEffect(() => {
    if (appState.cPage !== 'HOME') {
      dispatch(setCurrentPage({ cPage: 'HOME' }));
    }
    console.log('[Home] [] appState :[', appState.cState, '] cPage: [', appState.cPage, ']');
    try {
      if (shipData.init === 'INIT') {
        console.log('[INIT] {1}: Async anonymous function call to init data.');
        (async () => {
          const initDataObj = await initData();
          await shipData.setArray(initDataObj.shipData);
          setShipCount(shipData.shipsArr.length);
          dispatch(initShipLists(initDataObj.ownedShips, shipData));
        })();
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
  }, []);

  useEffect(() => {
    setDocksCount(ownedList.length);
  }, [ownedList]);

  const updateData = () => {
    dispatch(updateShipData());
  };

  const renderUpdate = () => {
    if (appState.cState === 'UPDATING') {
      return <span>Please wait</span>;
    }
    return (
      <button className="btn dark" onClick={() => updateData()}>
        Update
      </button>
    );
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <div className="home-container dark">
          <div className="f-grid">
            <div className="f-row">
              <div className="f-title">Options</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">{renderUpdate()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">
                <button className="btn dark">Update</button>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
            </div>
            <div className="f-row">
              <div className="f-title">Stats</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship count</div>
              <div className="grid-item action">{appState.cState === 'INIT' ? '-' : shipCount}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Docks count</div>
              <div className="grid-item action">{appState.cState === 'INIT' ? '-' : docksCount}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Placeholder</div>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default Home;

Home.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
