import React from 'react';
import PageTemplate from '_/components/PageTemplate';
import ShipDetails from '_/components/ShipDetails';
import { RootState } from '_/reducers/rootReducer';
import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import ShipList from './ShipList';

/**
 * Component for a ship details view.
 */
const ShipDetailView: React.FC = () => {
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
            <SideBar>
              <ShipList shipSearchList={shipSearchList} listName="ALL" />
              <ShipList shipSearchList={ownedSearchList} listName="OWNED" />
            </SideBar>
            <div className="ship-data-container">
              <ShipDetails />
            </div>
          </>
        )}
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
