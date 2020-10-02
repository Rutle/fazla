/* eslint-disable react/prop-types */
import React, { useCallback, useContext } from 'react';
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

ReactModal.setAppElement('#root');
const FormationView: React.FC = () => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const formationModal = useSelector((state: RootState) => state.formationModal);
  const appState = useSelector((state: RootState) => state.appState);

  const open = useCallback(
    (action: FormationModalAction, toggle: 'ALL' | 'OWNED', isOpen: boolean, index: number, data: DataStore) => () => {
      dispatch(formationModalAction(action, toggle, isOpen, index, data));
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
    return (
      <>
        <FormationGrid themeColor={config.themeColor}>
          {fData.formations[index].data.map((id, index) => (
            <FormationGridItem
              key={`${id}-${index}`}
              index={index}
              ship={formationShips[id]}
              themeColor={config.themeColor}
              onClick={open(FormationModalAction.Open, appState.cToggle, true, index, shipData)}
            />
          ))}
        </FormationGrid>
        <div className="scroll">
          <FormationPassives
            formationShips={formationShips}
            formation={fData.formations[index]}
            themeColor={config.themeColor}
          />
        </div>
      </>
    );
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <ReactModal
          overlayClassName={`modal-overlay ${config.themeColor}`}
          isOpen={formationModal.isOpen}
          className={`modal-container formation`}
          onRequestClose={() => dispatch(formationModalAction(FormationModalAction.Close))}
        >
          <FormationModalContent />
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
