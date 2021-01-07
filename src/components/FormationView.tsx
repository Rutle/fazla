/* eslint-disable react/prop-types */
import React, { useCallback, useContext, useState } from 'react';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import FormationModalContent from './Modal/FormationModalContent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { formationAction, FormationAction } from '../reducers/slices/formationGridSlice';
import FormationDropDown from './DropDown/FormationDropDown';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMouse } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import { formationModalAction, FormationModalAction } from '../reducers/slices/formationModalSlice';
import { Ship } from '../util/types';
import FormationGridItem from './FormationGridItem';
import { AppContext } from '../App';
import DataStore from '../util/dataStore';
import NewFormationModalContent from './Modal/NewFormationModalContent';

ReactModal.setAppElement('#root');
/**
 * View for displaying a formation page.
 */
const FormationView: React.FC = () => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const formationModal = useSelector((state: RootState) => state.formationModal);
  const appState = useSelector((state: RootState) => state.appState);
  const [showModal, setModalOpen] = useState(false);

  const open = useCallback(
    (action: FormationModalAction, toggle: 'ALL' | 'OWNED', isOpen: boolean, index: number, data: DataStore) => () => {
      dispatch(formationModalAction(action, toggle, isOpen, index, data));
      setModalOpen(true);
    },
    [dispatch],
  );
  const renderContent = (index: number) => {
    const formationShips = shipData.shipsArr
      .filter((ship) => fData.formations[index].data.includes(ship.id))
      .reduce(
        (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
        {} as { [key: string]: Ship },
      );

    const fleetCount = fData.formations[index].data.length / 6;
    const grid = [];
    const passives = [];
    for (let idx = 0; idx < fleetCount; idx++) {
      const temp = fData.formations[index].data.slice(idx * 6, idx * 6 + 6);
      grid.push(
        <FormationGrid key={idx} themeColor={config.themeColor}>
          {temp.map((id, idxx) => (
            <FormationGridItem
              key={`${id}-${idx * 6 + idxx}`}
              index={idx * 6 + idxx}
              ship={formationShips[id]}
              themeColor={config.themeColor}
              onClick={open(FormationModalAction.Open, appState.cToggle, true, idx * 6 + idxx, shipData)}
            />
          ))}
        </FormationGrid>,
      );
      passives.push(
        <FormationPassives
          key={`${'passive'}-${idx}`}
          formationShips={formationShips}
          formation={temp}
          themeColor={config.themeColor}
          fleetNumber={idx + 1}
        />,
      );
    }

    return (
      <>
        {grid}
        <div className="scroll">{passives}</div>
      </>
    );
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <ReactModal
          overlayClassName={`modal-overlay ${config.themeColor}`}
          // isOpen={formationModal.isOpen}
          isOpen={showModal}
          className={`modal-container ${formationModal.isOpen ? 'formation' : 'new-formation'}`}
          // onRequestClose={() => dispatch(formationModalAction(FormationModalAction.Close))}
        >
          {formationModal.isOpen ? (
            <FormationModalContent setModalOpen={setModalOpen} />
          ) : (
            <NewFormationModalContent setModalOpen={setModalOpen} />
          )}
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
        <div className={'ship-data-container'}>
          <div className="top-container">
            <div className={`tab`}>
              <FormationDropDown />
              <button
                className={`tab-btn normal ${config.themeColor}`}
                // onClick={() => dispatch(formationAction(FormationAction.New))}
                onClick={() => setModalOpen(true)}
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
                  <button className={`tab-btn normal ${config.themeColor} `} onClick={() => console.log('TODO')}>
                    Rename
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          {fData.formations.length !== 0 ? (
            <>{renderContent(fData.selectedIndex)}</>
          ) : (
            <div className="info-text">Please create new formation</div>
          )}
        </div>
      </section>
    </PageTemplate>
  );
};

export default FormationView;
