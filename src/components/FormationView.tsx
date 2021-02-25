import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactModal from 'react-modal';
import { AppContext } from '_/App';
import { formationAction, FormationAction } from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { RootState } from '_/reducers/rootReducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition } from 'react-transition-group';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import FormationDropDown from './DropDown/FormationDropDown';
import NewFormationModalContent from './Modal/NewFormationModalContent';
import RenameFormationModalContent from './Modal/RenameFormationModalContent';
import RButton from './RButton/RButton';
import ImportExportModalContent from './Modal/ImportExportModalContent';
import ShipList from './ShipList';
import SideBar from './SideBar';
import ShipDetails from './ShipDetails';
import useVisibility from './Visibility/useVisibility';
import { ArrowDegUp, CloseIcon } from './Icons';

ReactModal.setAppElement('#root');
/**
 * View for displaying a formation page.
 */
const FormationView: React.FC = () => {
  const dispatch = useDispatch();
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const { shipData, storage } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const appState = useSelector((state: RootState) => state.appState);
  const [showModal, setModalOpen] = useState({ modal: '', isOpen: false });
  const [fleetTabIndex, setFleetTabIndex] = useState(0);
  const [formationData, setFormationData] = useState<Ship[][]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(NaN);
  const refData = useRef<HTMLDivElement>(null);
  const refTransition = useRef<HTMLDivElement>(null);
  const [isVisible, refSide] = useVisibility();

  useEffect(() => {
    setFleetTabIndex(0);
  }, [fData.selectedIndex]);

  useEffect(() => {
    if (fData.formations.length !== 0) {
      const formationShips = shipData
        .getShips()
        .filter((ship) => fData.formations[fData.selectedIndex].data.includes(ship.id))
        .reduce(
          (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
          {} as { [key: string]: Ship }
        );
      const fleetCount = fData.formations[fData.selectedIndex].data.length / 6;
      const form = [];
      for (let idx = 0; idx < fleetCount; idx += 1) {
        const temp = fData.formations[fData.selectedIndex].data.slice(idx * 6, idx * 6 + 6);
        form.push(temp.map((id) => formationShips[id]));
      }
      setFormationData(form);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex, fData.formations]);

  // Update search list and show the search section.
  const showSearchSection = (isOpen: boolean, gridIndex: number) => {
    setSelectedGrid(gridIndex);
    dispatch(formationAction(FormationAction.Search, { shipData, gridIndex, isOpen }));
    setShowSearch(isOpen);
  };
  const hideSearchSection = (isOpen: boolean) => {
    dispatch(formationAction(FormationAction.Search, { shipData, isOpen }));
    setShowSearch(isOpen);
  };
  const addShip = () => {
    dispatch(formationAction(FormationAction.AddShip, { shipData, gridIndex: selectedGrid }));
    setShowSearch(false);
  };

  const scrollTo = (loc: string) => {
    if (loc === 'top' && refSide && refSide.current) {
      refSide.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
    if (loc === 'ship' && refData && refData.current) {
      refData.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  };

  const renderModal = (): JSX.Element => {
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
      setModalOpen({ modal: '', isOpen: false });
    }
  };
  // Save data
  useEffect(() => {
    if (fData.isEdit.some((val) => val !== false)) {
      dispatch(formationAction(FormationAction.Save, { storage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fData.isEdit]);
  return (
    <PageTemplate>
      <>
        <section className="page-content formations">
          <ReactModal
            overlayClassName={`modal-overlay ${config.themeColor}`}
            isOpen={showModal.isOpen}
            className={`modal-container ${showModal.modal === 'shiplist' ? 'ship-select' : 'formation-action'}`}
            onRequestClose={requestClose}
          >
            {renderModal()}
          </ReactModal>
          <div id="formation-content" className="ship-data-container">
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
                    onClick={() => dispatch(formationAction(FormationAction.Remove, { storage }))}
                    disabled={fData.formations.length === 0}
                  >
                    Remove
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
              <>
                <div
                  style={{
                    marginBottom: '15px',
                    borderBottom: `1px solid var(--main-${config.themeColor}-border)`,
                  }}
                >
                  <FormationGrid
                    themeColor={config.themeColor}
                    selectedIndex={fleetTabIndex}
                    ships={formationData}
                    openSearchSection={showSearchSection}
                  />
                </div>
                <div id="fleet-selector" className="tab">
                  {formationData.map((fleet, idx) => {
                    return (
                      <RButton
                        key={`${'button'}-${idx * fleet.length}`}
                        themeColor={config.themeColor}
                        className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
                        onClick={() => {
                          setFleetTabIndex(idx);
                        }}
                        disabled={fData.formations.length === 0}
                      >
                        {`Fleet ${idx + 1}`}
                      </RButton>
                    );
                  })}
                </div>
                <div className="scroll">
                  {formationData.map((fleet, idx) => {
                    return (
                      <div key={`tab${fleet.length * idx}`} className={`${fleetTabIndex !== idx ? 'hidden' : ''}`}>
                        <FormationPassives
                          key={`${'passive'}-${idx * fleet.length}`}
                          fleet={fleet}
                          themeColor={config.themeColor}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
                <div
                  className={`message-container ${config.themeColor}`}
                  style={{
                    alignSelf: 'center',
                    width: '50%',
                    minHeight: '40px',
                  }}
                >
                  <span className="message" style={{ fontSize: '24px', justifyContent: 'center' }}>
                    No formations.
                  </span>
                </div>
              </div>
            )}
          </div>
          <CSSTransition nodeRef={refTransition} in={showSearch} timeout={200} classNames="my-node">
            <div id="formation-ship-search" ref={refTransition}>
              <SideBar refer={refSide}>
                <ShipList shipSearchList={shipSearchList} listName="ALL" scrollTo={() => scrollTo('ship')} />
                <ShipList shipSearchList={ownedSearchList} listName="OWNED" scrollTo={() => scrollTo('ship')} />
              </SideBar>
              <div id="sidebar-slider" className={`button-group ${config.themeColor}`} style={{ width: 'unset' }}>
                {!isVisible ? (
                  <RButton themeColor={config.themeColor} className="btn slide" onClick={() => scrollTo('top')}>
                    <ArrowDegUp themeColor={config.themeColor} />
                  </RButton>
                ) : (
                  <></>
                )}

                <RButton themeColor={config.themeColor} className="btn slide" onClick={() => hideSearchSection(false)}>
                  <CloseIcon themeColor={config.themeColor} />
                </RButton>
              </div>
              <div className={`ship-data-container ${config.themeColor}`} ref={refData}>
                <ShipDetails />
                {shipData.getShips()[appState[appState.cToggle].index] ? (
                  <RButton
                    themeColor={config.themeColor}
                    onClick={addShip}
                    extraStyle={{ marginTop: '5px', height: '50px' }}
                  >
                    Add to formation
                  </RButton>
                ) : (
                  <> </>
                )}
              </div>
            </div>
          </CSSTransition>
        </section>
      </>
    </PageTemplate>
  );
};

export default FormationView;
