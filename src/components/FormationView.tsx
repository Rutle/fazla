/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
// import Menu from './Menu';
import FormationModal from './FormationModal';
import DataStore from '../util/dataStore';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setCurrentPage, createEmptyFormation } from '../reducers/slices/appStateSlice';
import FormationDropDown from './DropDown/FormationDropDown';
interface FormationViewProps {
  shipData: DataStore;
}

const FormationView: React.FC<FormationViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (appState.cPage !== 'FORMATION') {
      console.log(appState);
      dispatch(setCurrentPage({ cPage: 'FORMATION' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addNewFormation = () => {
    dispatch(createEmptyFormation());
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <FormationModal shipData={shipData} />
        <div className={'ship-data-container dark'}>
          <div className="top-container">
            <div className={`tab dark`}>
              <FormationDropDown />
              <button className={`tab-btn ${appState.themeColor} `} onClick={() => addNewFormation()}>
                New formation
              </button>
              <button className={`tab-btn ${appState.themeColor} `} onClick={() => console.log('Remove')}>
                Remove
              </button>
              <button className={`tab-btn ${appState.themeColor} `} onClick={() => console.log('Save')}>
                Save
              </button>
              <button className={`tab-btn ${appState.themeColor} `} onClick={() => console.log('Save')}>
                Rename
              </button>
            </div>
          </div>
          <FormationGrid shipData={shipData} />
          <div className="scroll">
            <FormationPassives shipData={shipData} />
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
