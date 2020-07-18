import React, { useState } from 'react';
import PageTemplate from './PageTemplate';
// import ShipList from './ShipList';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import Menu from './Menu';
// import { RootState } from '../reducers/rootReducer';
import FormationModal from './FormationModal';

const FormationView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Formation');

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        {/* <ShipList /> */}
        <FormationModal />
        <div className={'ship-data-container dark'}>
          <div className="top-container">
            <Menu setActiveTab={setSelectedTab} currentActiveTab={selectedTab} tabs={['Formation', 'Summary']} />
            <div id="formation" className={`tab-content ${selectedTab === 'Formation' ? 'active' : 'hidden'}`}>
              {/*
                <div style={{ color: 'black', backgroundColor: 'gray', height: '35px', width: '100%' }}>DropDown</div>
                */}
              {/* 
              <div className={''}>Selected ship:</div>
              <PassivesList orient={'horizontal'} page={'formation'} /> 
              <FormationDropDownMenu />*/}
              <FormationGrid />
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
