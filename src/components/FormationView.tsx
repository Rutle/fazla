import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import PassivesList from './PassivesList';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';

const FormationView: React.FC = () => {
  const [listToggle, setListToggle] = useState('all');
  const config = useSelector((state: RootState) => state.config);

  const [selectedTab, setSelectedTab] = useState('formation');

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <ShipList listToggle={listToggle} setListToggle={setListToggle} />
        <div id="ship-data">
          <div className="top-container">
            <div className={`tab ${config.themeColor}`}>
              <button
                className={`tab-btn ${config.themeColor} ${selectedTab === 'search' ? 'active' : ''}`}
                onClick={() => setSelectedTab('formation')}
              >
                Formation
              </button>
              <button
                className={`tab-btn ${config.themeColor} ${selectedTab === 'summary' ? 'active' : ''}`}
                onClick={() => setSelectedTab('summary')}
              >
                Summary
              </button>
              <button
                className={`tab-btn ${config.themeColor} ${selectedTab === 'PH2' ? 'active' : ''}`}
                onClick={() => setSelectedTab('PH1')}
              >
                PH1
              </button>
            </div>
            <div id="search" className={`tab-content ${selectedTab === 'formation' ? 'active' : 'hidden'}`}>
              {/*
                <div style={{ color: 'black', backgroundColor: 'gray', height: '35px', width: '100%' }}>DropDown</div>
                */}
              {/* 
              <div className={''}>Selected ship:</div>
              <PassivesList orient={'horizontal'} page={'formation'} /> 
              <FormationDropDownMenu />*/}
              <FormationGrid />
            </div>
            <div id="PH1" className={`tab-content ${selectedTab === 'summary' ? 'active' : 'hidden'}`}>
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
