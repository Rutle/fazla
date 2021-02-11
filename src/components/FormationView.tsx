import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import { faMouse } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import { AppContext } from '_/App';
import { formationModalAction, FormationModalAction } from '_/reducers/slices/formationModalSlice';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import DataStore from '_/utils/dataStore';
import { Ship } from '_/utils/types';
import { RootState } from '_/reducers/rootReducer';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import FormationModalContent from './Modal/FormationModalContent';
import FormationDropDown from './DropDown/FormationDropDown';
import FormationGridItem from './FormationGridItem';
import NewFormationModalContent from './Modal/NewFormationModalContent';
import RenameFormationModalContent from './Modal/RenameFormationModalContent';
import RButton from './RButton/RButton';
import ImportExportModalContent from './Modal/ImportExportModalContent';

ReactModal.setAppElement('#root');
/**
 * View for displaying a formation page.
 */
const FormationView: React.FC = () => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const appState = useSelector((state: RootState) => state.appState);
  const [showModal, setModalOpen] = useState({ modal: '', isOpen: false });
  const [fleetTabIndex, setFleetTabIndex] = useState(0);

  useEffect(() => {
    // Rebuild tooltip after selecting different formation or existing formation is modified.
    ReactTooltip.rebuild();
  }, [fData]);

  const open = useCallback(
    (action: FormationModalAction, toggle: 'ALL' | 'OWNED', index: number, data: DataStore) => () => {
      dispatch(formationModalAction(action, toggle, index, data));
      setModalOpen({ modal: 'shiplist', isOpen: true });
    },
    [dispatch]
  );

  const renderContent = (index: number) => {
    // Filter ship data by taking only ships that are in the formations.
    // [{ id: shipData }]
    const formationShips = shipData.shipsArr
      .filter((ship) => fData.formations[index].data.includes(ship.id))
      .reduce(
        (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
        {} as { [key: string]: Ship }
      );
    const fleetCount = fData.formations[index].data.length / 6;
    const grid = [];
    const passives = [];
    const tabs = [];
    for (let idx = 0; idx < fleetCount; idx += 1) {
      const temp = fData.formations[index].data.slice(idx * 6, idx * 6 + 6);
      grid.push(
        <FormationGrid key={idx} themeColor={config.themeColor} isTitle={idx === 0}>
          {temp.map((id, idxx) => (
            <FormationGridItem
              key={`${id}-${idx * 6 + idxx}`}
              index={idx * 6 + idxx}
              ship={formationShips[id]}
              themeColor={config.themeColor}
              onClick={open(FormationModalAction.Open, appState.cToggle, idx * 6 + idxx, shipData)}
            />
          ))}
        </FormationGrid>
      );
      passives.push(
        <FormationPassives
          key={`${'passive'}-${idx}`}
          formationShips={formationShips}
          formation={temp}
          themeColor={config.themeColor}
          fleetNumber={idx + 1}
        />
      );
      tabs.push(
        <RButton
          key={`${'button'}-${idx}`}
          themeColor={config.themeColor}
          className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
          onClick={() => setFleetTabIndex(idx)}
          disabled={fData.formations.length === 0}
        >
          {`Fleet ${idx + 1}`}
        </RButton>
      );
    }
    return (
      <>
        <div style={{ marginBottom: '15px', borderBottom: `1px solid var(--main-${config.themeColor}-border)` }}>
          {grid}
        </div>
        <div className="tab">{tabs}</div>
        <div className="scroll">{passives[fleetTabIndex]}</div>
      </>
    );
  };

  const renderModal = (): JSX.Element => {
    if (showModal.modal === 'shiplist') {
      return <FormationModalContent setModalOpen={setModalOpen} />;
    }
    if (showModal.modal === 'new') {
      return <NewFormationModalContent setModalOpen={setModalOpen} />;
    }
    if (showModal.modal === 'rename') {
      return <RenameFormationModalContent setModalOpen={setModalOpen} />;
    }
    if (showModal.modal === 'import' || showModal.modal === 'export') {
      return <ImportExportModalContent setModalOpen={setModalOpen} isType={showModal.modal} />;
    }
    return <></>;
  };

  const requestClose = () => {
    if (showModal.isOpen) {
      dispatch(formationModalAction(FormationModalAction.Close, appState.cToggle, 0, shipData));
      setModalOpen({ modal: '', isOpen: false });
    }
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <ReactModal
          overlayClassName={`modal-overlay ${config.themeColor}`}
          isOpen={showModal.isOpen}
          className={`modal-container ${showModal.modal === 'shiplist' ? 'ship-select' : 'formation-action'}`}
          onRequestClose={requestClose}
        >
          {renderModal()}
        </ReactModal>
        {config.formHelpTooltip && fData.formations.length > 0 ? (
          <ReactTooltip id="click-help" place="bottom" type="dark" effect="solid" aria-haspopup="true" delayShow={1000}>
            <span>
              Add <FontAwesomeIcon icon={faMouse} /> Clear
            </span>
          </ReactTooltip>
        ) : (
          <></>
        )}
        <div className="ship-data-container">
          <div className="tab">
            {fData.formations.length !== 0 ? <FormationDropDown /> : <></>}
            <RButton
              themeColor={config.themeColor}
              className="tab-btn normal"
              onClick={() => setModalOpen({ modal: 'new', isOpen: true })}
            >
              New
            </RButton>
            {fData.formations.length !== 0 ? (
              <>
                <RButton
                  themeColor={config.themeColor}
                  className="tab-btn normal"
                  onClick={() => dispatch(formationAction(FormationAction.Remove, {}))}
                  disabled={fData.formations.length === 0}
                >
                  Remove
                </RButton>
                <RButton
                  themeColor={config.themeColor}
                  className={`tab-btn normal ${fData.isEdit[fData.selectedIndex] ? 'selected' : ''}`}
                  onClick={() => dispatch(formationAction(FormationAction.Save, {}))}
                  disabled={!fData.isEdit[fData.selectedIndex]}
                >
                  Save
                </RButton>
                <RButton
                  themeColor={config.themeColor}
                  className="tab-btn normal"
                  onClick={() => setModalOpen({ modal: 'rename', isOpen: true })}
                >
                  Rename
                </RButton>
                <RButton
                  themeColor={config.themeColor}
                  className="tab-btn normal"
                  onClick={() => setModalOpen({ modal: 'export', isOpen: true })}
                >
                  Export
                </RButton>
                <RButton
                  themeColor={config.themeColor}
                  className="tab-btn normal"
                  onClick={() => setModalOpen({ modal: 'import', isOpen: true })}
                >
                  Import
                </RButton>
              </>
            ) : (
              <></>
            )}
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
