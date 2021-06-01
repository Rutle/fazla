import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactModal from 'react-modal';
import { AppContext } from '_/App';
import {
  formationAction,
  FormationAction,
  MAININDEX,
  SUBMARINE,
  VANGUARDINDEX,
} from '_/reducers/slices/formationGridSlice';
import { Ship } from '_/types/types';
import { RootState } from '_/reducers/rootReducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition } from 'react-transition-group';
import { SearchAction, setFleet, updateSearch } from '_/reducers/slices/searchParametersSlice';
import { setIsUpdated } from '_/reducers/slices/appStateSlice';
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
import { ArrowDegUp, CloseIcon, PlusIcon, QuestionCircleIcon } from './Icons';
import TooltipWrapper from './Tooltip/TooltipWrapper';

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
  const [fleetCount, setFleetCount] = useState(0);
  const [isSubFleet, setIsSubFleet] = useState(false);

  const scrollTo = (loc: string) => {
    if (loc === 'top' && refSide && refSide.current) {
      refSide.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
    if (loc === 'ship' && refData && refData.current) {
      refData.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  };

  const hideSearchSection = (isOpen: boolean) => {
    setShowSearch(isOpen);
    setSelectedGrid(NaN);
    dispatch(setFleet({ fleet: 'ALL' }));
  };

  useEffect(() => {
    setFleetTabIndex(0);
    hideSearchSection(false);
    setSelectedGrid(NaN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex]);

  useEffect(() => {
    if (showSearch) scrollTo('top');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch]);

  // Update currently selected formation data.
  useEffect(() => {
    if (fData.formations.length !== 0) {
      // Find Ship data for each ship ID in the formation and transform it to key-value pairs of
      // { ID:Ship }
      const formationShips = shipData
        .getShips()
        .filter((ship) => fData.formations[fData.selectedIndex].data.includes(ship.id))
        .reduce(
          (accumulator, currentValue) => Object.assign(accumulator, { [currentValue.id]: currentValue }),
          {} as { [key: string]: Ship }
        );
      const formLen = fData.formations[fData.selectedIndex].data.length;
      const fleetCnt = Math.floor(formLen / 6);
      const form = [];
      // Normal ships
      // Slice array of formation IDs into size 6 and match the ID with correct ship.
      for (let idx = 0; idx < fleetCnt; idx += 1) {
        const temp = fData.formations[fData.selectedIndex].data.slice(idx * 6, idx * 6 + 6);
        form.push(temp.map((id) => formationShips[id]));
      }
      // Submarines
      // Submarines are at the end of the array.
      if (formLen === 15 || formLen === 27) {
        const temp = fData.formations[fData.selectedIndex].data.slice(-3);
        form.push(temp.map((id) => formationShips[id]));
        setIsSubFleet(true);
      } else {
        // In case of old formation data.
        setIsSubFleet(false);
      }
      setFormationData(form);
      setFleetCount(fleetCnt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex, fData.formations]);

  // Update search list and show the search section.
  const showSearchSection = (isOpen: boolean, gridIndex: number) => {
    setSelectedGrid(gridIndex);
    // dispatch(formationAction(FormationAction.Search, { shipData, gridIndex }));
    if (!Number.isNaN(gridIndex) && shipData && gridIndex !== undefined) {
      let fleet: 'ALL' | 'VANGUARD' | 'MAIN' | 'SUBMARINE' = 'ALL';
      if (MAININDEX[fleetCount].includes(gridIndex)) {
        fleet = 'MAIN';
      } else if (VANGUARDINDEX[fleetCount].includes(gridIndex)) {
        fleet = 'VANGUARD';
      } else if (SUBMARINE[fleetCount].includes(gridIndex)) {
        fleet = 'SUBMARINE';
      }
      dispatch(setFleet({ fleet }));
      dispatch(setIsUpdated({ key: appState.cToggle, value: false }));
      dispatch(
        updateSearch(shipData, SearchAction.UpdateList, {
          list: appState.cToggle,
        })
      );
    }
    setShowSearch(isOpen);
  };

  const addShip = () => {
    dispatch(formationAction(FormationAction.AddShip, { shipData, gridIndex: selectedGrid }));
    setShowSearch(false);
    setSelectedGrid(NaN);
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

  // Save data when formation data is edited.
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
            className="modal-container formation-action"
            onRequestClose={requestClose}
          >
            {renderModal()}
          </ReactModal>
          <div id="formation-content" className="container content">
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
                  <TooltipWrapper
                    // data={`Left mouse click to select.\nRight mouse click to remove.\nDrag and drop ships.`}
                    data={
                      <dl>
                        <dt>Add ship</dt>
                        <dd>Left mouse click to select.</dd>
                        <dt>Remove ship</dt>
                        <dd>Right mouse click to remove.</dd>
                        <dt>Drag</dt>
                        <dd>Drag and drop ships.</dd>
                      </dl>
                    }
                    WrapperElement="div"
                    wrapperClassNames="icon help"
                    placement="bottom"
                  >
                    <QuestionCircleIcon themeColor={config.themeColor} />
                  </TooltipWrapper>
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
                    selectedFleetIndex={fleetTabIndex}
                    ships={formationData}
                    openSearchSection={showSearchSection}
                    selectedGridIndex={selectedGrid}
                    fleetCount={fleetCount}
                    isSubFleet={isSubFleet}
                  />
                </div>
                <div id="fleet-selector" className="tab">
                  {formationData.map((fleet, idx) => {
                    return (
                      <RButton
                        key={`${'fleet-button'}-${idx * formationData.length}`}
                        themeColor={config.themeColor}
                        className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
                        onClick={() => {
                          setFleetTabIndex(idx);
                        }}
                        disabled={fData.formations.length === 0}
                      >
                        {idx + 1 === formationData.length && isSubFleet ? 'Submarines' : `Fleet ${idx + 1}`}
                      </RButton>
                    );
                  })}
                </div>
                <div className="scroll">
                  {formationData.map((fleet, idx) => {
                    return (
                      <div
                        id="passive-section"
                        key={`tab${idx * formationData.length}`}
                        className={`${fleetTabIndex !== idx ? 'hidden' : ''}`}
                      >
                        <FormationPassives
                          key={`${'passive'}-${idx * formationData.length}`}
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
          <CSSTransition nodeRef={refTransition} in={showSearch} timeout={300} classNames="search-section">
            <div
              id="formation-ship-search"
              ref={refTransition}
              className={`${fleetCount === 2 ? 'normal-fleet' : 'siren-fleet'}`}
            >
              <SideBar refer={refSide}>
                <ShipList shipSearchList={shipSearchList} listName="ALL" scrollTo={() => scrollTo('ship')} />
                <ShipList shipSearchList={ownedSearchList} listName="OWNED" scrollTo={() => scrollTo('ship')} />
              </SideBar>
              <div id="side-scroll" className={`button-group ${config.themeColor}`} style={{ width: 'unset' }}>
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
              <div className={`container content ${config.themeColor}`} ref={refData}>
                <ShipDetails
                  topButtonGroup={
                    <>
                      <RButton themeColor={config.themeColor} onClick={addShip} className="btn normal icon">
                        <PlusIcon themeColor={config.themeColor} />
                        Formation
                      </RButton>
                    </>
                  }
                />
              </div>
            </div>
          </CSSTransition>
        </section>
      </>
    </PageTemplate>
  );
};

export default FormationView;
