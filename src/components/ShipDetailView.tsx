/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PageTemplate from './PageTemplate';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';
import { setCurrentPage, initShipLists } from '../reducers/slices/appStateSlice';
import { getDatastore, initData } from '../util/appUtilities';

interface ShipDetailViewProps {
  shipData: DataStore;
  setShipData: (e: React.SetStateAction<DataStore>) => void;
}
const ShipDetailView: React.FC<ShipDetailViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    // console.log('[ShipDetailView] [] appState :[', appState.cState, '] cPage: [', appState.cPage, ']');
    if (appState.cPage !== 'LIST') {
      dispatch(setCurrentPage({ cPage: 'LIST' }));
    }
    try {
      if (shipData.init === 'INIT') {
        // console.log('[INIT] {1}: Async anonymous function call to init data.');
        (async () => {
          const initDataObj = await initData();
          await shipData.setArray(initDataObj.shipData);
          // setShipCount(shipData.shipsArr.length);
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
          // setJSONSRCValue(initDataObj.config.jsonURL);
        })();
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderShipDetails = () => {
    if (appState.cState === 'INIT') {
      return <div className="info-text">{appState.cMsg}</div>;
    }
    return <ShipDetails ship={shipData.shipsArr[shipDetails.index]} />;
    // return <ShipDetails ship={getDatastore().getShipByIndex(shipDetails.index)} />;
  };

  return (
    <PageTemplate>
      <section className="page-content">
        {appState.cState === 'INIT' ? (
          <div className="info-text">{appState.cMsg}</div>
        ) : (
          <>
            <SideBar shipData={shipData} />
            <div className="ship-data-container dark">{renderShipDetails()}</div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
