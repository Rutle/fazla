/* eslint-disable react/prop-types */
import React from 'react';
import PageTemplate from './PageTemplate';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';

interface ShipDetailViewProps {
  shipData: DataStore;
}
const ShipDetailView: React.FC<ShipDetailViewProps> = ({ shipData }) => {
  const appState = useSelector((state: RootState) => state.appState);

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
              <ShipDetails shipData={shipData} />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
