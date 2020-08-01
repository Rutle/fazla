import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';

const ShipDetailView: React.FC = () => {
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const appState = useSelector((state: RootState) => state.appState);
  const [isShips, setIsShips] = useState(false);

  useEffect(() => {
    setIsShips(shipSearchList.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    // Check if there any ships left.
    switch (appState.cToggle) {
      case 'all':
        setIsShips(shipSearchList.length > 0);
        break;
      case 'owned':
        setIsShips(ownedSearchList.length > 0);
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
          <div className="scroll">
            <ShipDetails />
          </div>
        </>
      );
    }
  };
  return (
    <PageTemplate>
      <section className="page-content">
        <ShipList />
        <div className="ship-data-container dark">{renderShipDetails()}</div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
