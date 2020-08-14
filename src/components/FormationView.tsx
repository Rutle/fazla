/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import Menu from './Menu';
import FormationModal from './FormationModal';
import DataStore from '../util/dataStore';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setCurrentPage } from '../reducers/slices/appStateSlice';
interface FormationViewProps {
  shipData: DataStore;
}

const FormationView: React.FC<FormationViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('Formation');
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (appState.cPage !== 'FORMATION') {
      dispatch(setCurrentPage({ cPage: 'FORMATION' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTemplate>
      <section className="page-content">
        <FormationModal shipData={shipData} />
        <div className={'ship-data-container dark'}>
          <div className="top-container">
            <Menu setActiveTab={setSelectedTab} currentActiveTab={selectedTab} tabs={['Formation', 'Summary']} />
          </div>
          <div className="scroll">
            <div id="formation" className={`tab-content ${selectedTab === 'Formation' ? 'active' : 'hidden'}`}>
              <FormationGrid shipData={shipData} />
              <div className="scroll">
                <FormationPassives shipData={shipData} />
              </div>
            </div>
            <div id="summary" className={`tab-content ${selectedTab === 'Summary' ? 'active' : 'hidden'}`}>
              <FormationPassives shipData={shipData} />
            </div>
            <div id="PH2" className={`tab-content ${selectedTab === 'PH2' ? 'active' : 'hidden'}`}>
              PH2
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
