/* eslint-disable react/prop-types */
import React from 'react';
import PageTemplate from './PageTemplate';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';
import DataStore from '../util/dataStore';
import SideBar from './SideBar';
import ShipList from './ShipList';

interface ShipDetailViewProps {
  shipData: DataStore;
}
const ShipDetailView: React.FC<ShipDetailViewProps> = ({ shipData }) => {
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);

  return (
    <PageTemplate>
      <section className="page-content">
        {appState.cState === 'INIT' ? (
          <div className="ship-data-container">
            <div className="info-text">{appState.cMsg}</div>
          </div>
        ) : (
          <>
            <SideBar shipData={shipData}>
              <ShipList shipData={shipData} shipSearchList={shipSearchList} listName={'ALL'} />
              <ShipList shipData={shipData} shipSearchList={ownedSearchList} listName={'OWNED'} />
            </SideBar>
            <div className="ship-data-container">
              <ShipDetails shipData={shipData} />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
