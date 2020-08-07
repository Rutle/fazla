/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import Menu from './Menu';
import FormationModal from './FormationModal';
import DataStore from '../util/dataStore';
interface FormationViewProps {
  shipData: DataStore;
}

const FormationView: React.FC<FormationViewProps> = ({ shipData }) => {
  const [selectedTab, setSelectedTab] = useState('Formation');

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
              <FormationGrid />
              <div className="scroll">
                <FormationPassives />
              </div>
            </div>
            <div id="summary" className={`tab-content ${selectedTab === 'Summary' ? 'active' : 'hidden'}`}>
              <FormationPassives />
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
