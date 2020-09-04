/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';
import { setCurrentPage } from '../reducers/slices/appStateSlice';
interface ShipDetailViewProps {
  shipData: DataStore;
}
const ShipDetailView: React.FC<ShipDetailViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const appState = useSelector((state: RootState) => state.appState);
  const [isShips, setIsShips] = useState(false);

  useEffect(() => {
    setIsShips(shipSearchList.length > 0);
    console.log('[ShipDetailView] [] appState :[', appState.cState, '] cPage: [', appState.cPage, ']');
    if (appState.cPage !== 'LIST') {
      dispatch(setCurrentPage({ cPage: 'LIST' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check if there any ships left.
    console.log(appState.cToggle);
    switch (appState.cToggle) {
      case 'all':
        setIsShips(shipSearchList.length > 0);
        break;
      case 'owned':
        setIsShips(ownedSearchList.length > 0);
        console.log(appState.owned);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedSearchList, shipSearchList, appState.cToggle]);

  const renderShipDetails = () => {
    if (appState.cState === 'INIT') {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1>{appState.cMsg}</h1>
        </div>
      );
    }
    if (!isShips) {
      return (
        <div>
          <h1>No ship selected or found</h1>
        </div>
      );
    } else {
      return (
        <>
          <ShipDetails ship={shipData.shipsArr[shipDetails.index]} />
        </>
      );
    }
  };
  return (
    <PageTemplate>
      <section className="page-content">
        <SideBar shipData={shipData} />
        <div className="ship-data-container dark">{renderShipDetails()}</div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
