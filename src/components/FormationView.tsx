/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
// import Menu from './Menu';
import FormationModal from './FormationModal';
import DataStore from '../util/dataStore';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setCurrentPage } from '../reducers/slices/appStateSlice';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';
import FormationDropDown from './DropDown/FormationDropDown';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMouse } from '@fortawesome/free-solid-svg-icons';
interface FormationViewProps {
  shipData: DataStore;
}

const FormationView: React.FC<FormationViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const fData = useSelector((state: RootState) => state.formationGrid);

  useEffect(() => {
    if (appState.cPage !== 'FORMATION') {
      dispatch(setCurrentPage({ cPage: 'FORMATION' }));
      console.log(fData.formations.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTemplate>
      <section className="page-content">
        <FormationModal shipData={shipData} />
        <ReactTooltip id="click-help" place="bottom" type="dark" effect="solid" aria-haspopup="true" delayShow={1000}>
          <span>
            Add <FontAwesomeIcon icon={faMouse} /> Clear
          </span>
        </ReactTooltip>
        <div className={'ship-data-container dark'}>
          <div className="top-container">
            <div className={`tab dark`}>
              <FormationDropDown />
              <button
                className={`${appState.themeColor} `}
                onClick={() => dispatch(formationAction(FormationAction.New))}
              >
                New formation
              </button>
              {fData.formations.length !== 0 ? (
                <>
                  <button
                    className={`${appState.themeColor} `}
                    onClick={() => dispatch(formationAction(FormationAction.Remove))}
                    disabled={fData.formations.length === 0}
                  >
                    Remove
                  </button>
                  <button
                    className={`${appState.themeColor} ${fData.isEdit[fData.selectedIndex] ? 'inform' : ''}`}
                    onClick={() => dispatch(formationAction(FormationAction.Save))}
                  >
                    Save
                  </button>
                  <button className={`${appState.themeColor} `} onClick={() => console.log('Save')}>
                    Rename
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {fData.formations.length !== 0 ? (
            <>
              <FormationGrid shipData={shipData} formation={fData.formations[fData.selectedIndex]} />
              <div className="scroll">
                <FormationPassives shipData={shipData} formation={fData.formations[fData.selectedIndex]} />
              </div>
            </>
          ) : (
            <div id="formation-suggestion">Please create new formation</div>
          )}
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
