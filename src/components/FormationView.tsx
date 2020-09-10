/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import FormationModalContent from './Modal/FormationModalContent';
import DataStore from '../util/dataStore';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setCurrentPage } from '../reducers/slices/appStateSlice';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';
import FormationDropDown from './DropDown/FormationDropDown';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMouse } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import { formationModalAction, FormationModalAction } from '../reducers/slices/formationModalSlice';
interface FormationViewProps {
  shipData: DataStore;
}
ReactModal.setAppElement('#root');
const FormationView: React.FC<FormationViewProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const formationModal = useSelector((state: RootState) => state.formationModal);

  useEffect(() => {
    if (appState.cPage !== 'FORMATION') {
      dispatch(setCurrentPage({ cPage: 'FORMATION' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTemplate>
      <section className="page-content">
        <ReactModal
          overlayClassName="modal-overlay"
          isOpen={formationModal.isOpen}
          className={`formation-model-container ${config.themeColor}`}
          onRequestClose={() => dispatch(formationModalAction(FormationModalAction.Close))}
        >
          <FormationModalContent shipData={shipData} />
        </ReactModal>
        {config.formHelpTooltip ? (
          <ReactTooltip id="click-help" place="bottom" type="dark" effect="solid" aria-haspopup="true" delayShow={1000}>
            <span>
              Add <FontAwesomeIcon icon={faMouse} /> Clear
            </span>
          </ReactTooltip>
        ) : (
          <></>
        )}
        <div className={'ship-data-container dark'}>
          <div className="top-container">
            <div className={`tab dark`}>
              <FormationDropDown />
              <button
                className={`tab-btn normal ${config.themeColor}`}
                onClick={() => dispatch(formationAction(FormationAction.New))}
              >
                New
              </button>
              {fData.formations.length !== 0 ? (
                <>
                  <button
                    className={`tab-btn normal ${config.themeColor}`}
                    onClick={() => dispatch(formationAction(FormationAction.Remove))}
                    disabled={fData.formations.length === 0}
                  >
                    Remove
                  </button>
                  <button
                    className={`tab-btn normal ${config.themeColor} ${
                      fData.isEdit[fData.selectedIndex] ? 'inform' : ''
                    }`}
                    onClick={() => dispatch(formationAction(FormationAction.Save))}
                    disabled={!fData.isEdit[fData.selectedIndex]}
                  >
                    Save
                  </button>
                  <button className={`tab-btn normal ${config.themeColor} `} onClick={() => console.log('Save')}>
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
              <FormationGrid
                shipData={shipData}
                formation={fData.formations[fData.selectedIndex]}
                themeColor={config.themeColor}
              />
              <div className="scroll">
                <FormationPassives
                  shipData={shipData}
                  formation={fData.formations[fData.selectedIndex]}
                  themeColor={config.themeColor}
                />
              </div>
            </>
          ) : (
            <div className="info-text">Please create new formation</div>
          )}
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
