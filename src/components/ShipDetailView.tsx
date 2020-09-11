/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
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
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (appState.cPage !== 'LIST') {
      dispatch(setCurrentPage({ cPage: 'LIST' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTemplate>
      <section className="page-content">
        {appState.cState === 'INIT' ? (
          <div className="ship-data-container dark">
            <div className="info-text">{appState.cMsg}</div>
          </div>
        ) : (
          <>
            <SideBar shipData={shipData} />
            <div className="ship-data-container dark">
              <ShipDetails ship={shipData.shipsArr[shipDetails.index]} />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
