import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { Ship } from '_/types/shipTypes';
import { RootState } from '_/reducers/rootReducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition } from 'react-transition-group';
import { SearchAction, setFleet, updateSearch } from '_/reducers/slices/searchParametersSlice';
import { clearErrorMessage, setErrorMessage, setIsUpdated } from '_/reducers/slices/appStateSlice';
// eslint-disable-next-line import/no-extraneous-dependencies
import useResizeObserver from 'use-resize-observer';
import { getFormationData } from '_/utils/appUtilities';
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
import useVisibility from '../hooks/useVisibility';
import { ArrowDegUp, BoxArrowUp, CloseIcon, QuestionCircleIcon } from './Icons';
import TooltipWrapper from './Tooltip/TooltipWrapper';

ReactModal.setAppElement('#root');
/**
 * View for displaying a formation page.
 */
const FormationView: React.FC = () => {
  const dispatch = useDispatch();
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const { shipData, storage, addToast } = useContext(AppContext);
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
  const gridRef = useRef<HTMLDivElement>(null);
  const gridSize = useResizeObserver<HTMLDivElement>({ ref: gridRef });

  const scrollTo = useCallback(
    (loc: string) => {
      if (loc === 'top' && refSide && refSide.current) {
        refSide.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      }
      if (loc === 'ship' && refData && refData.current) {
        refData.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      }
      if (loc === 'reset' && refSide && refSide.current) {
        refSide.current.scrollIntoView(true);
      }
    },
    [refSide]
  );

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
    /* TODO: Check that is scrolls to top when search lit is hidden especially on small screen */
    if (showSearch) scrollTo('reset');
  }, [scrollTo, showSearch]);

  // Update currently selected formation data.
  useEffect(() => {
    if (fData.formations.length !== 0) {
      setFormationData([]);
      // get(fData.formations[fData.selectedIndex].data, shipData): <form[], isSubFleet, fleetcnt>
      getFormationData(fData.formations[fData.selectedIndex].data, shipData)
        .then((res) => {
          setIsSubFleet(res.isSubFleet);
          setFleetCount(res.fleetCount);
          setFormationData(res.data);
        })
        .catch((e) => {
          if (e instanceof Error) dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: e.message, eState: 'WARNING' }));
        });
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

  useEffect(() => {
    if (appState.cState === 'RUNNING') {
      hideSearchSection(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cState, config.themeColor]);

  useEffect(() => {
    if (appState.cState === 'RUNNING' && appState.eState === 'WARNING') {
      dispatch(clearErrorMessage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    onClick={() => dispatch(formationAction(FormationAction.Remove, { storage }, addToast))}
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
                    data={
                      <ul>
                        <li>Left mouse click to select a ship.</li>
                        <li>Right mouse click to remove a ship.</li>
                        <li>Drag and drop ships.</li>
                      </ul>
                    }
                    WrapperElement="div"
                    wrapperClassNames="icon help"
                    extraProps={{ style: { maxWidth: '16px' } }}
                  >
                    <QuestionCircleIcon themeColor={config.themeColor} />
                  </TooltipWrapper>
                </>
              ) : (
                <></>
              )}
            </div>
            {formationData.length !== 0 && fData.formations.length !== 0 ? (
              <>
                <FormationGrid
                  themeColor={config.themeColor}
                  selectedFleetIndex={fleetTabIndex}
                  ships={formationData}
                  openSearchSection={showSearchSection}
                  selectedGridIndex={selectedGrid}
                  fleetCount={fleetCount}
                  isSubFleet={isSubFleet}
                  refd={gridRef}
                />
                <div id="fleet-selector" className={`f-grid ${config.themeColor}`}>
                  <div className="f-row">
                    <div className="f-header tab-group" style={{ flex: '1', justifyContent: 'center' }}>
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
                  </div>
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
                          isSelected={fleetTabIndex === idx}
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
                    {appState.cState === 'RUNNING' && appState.eState === 'WARNING' ? (
                      <>{appState.eMsg}</>
                    ) : (
                      <>No formations.</>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          <CSSTransition nodeRef={refTransition} in={showSearch} timeout={300} classNames="search-section">
            <div
              id="formation-ship-search"
              ref={refTransition}
              className={`${fleetCount === 2 ? 'normal-fleet' : 'siren-fleet'}${isSubFleet ? ' sub-fleet' : ''} ${
                config.themeColor
              }`}
              style={
                gridSize.height
                  ? {
                      top: `${gridSize.height + 25 + 15 + 53}px`,
                      minHeight: `calc(100% - ${gridSize.height + 25 + 15 + 51 + 28}px)`,
                      height: `calc(100% - ${gridSize.height + 25 + 15 + 51 + 28}px)`,
                    }
                  : {}
              }
            >
              <SideBar refer={refSide}>
                <ShipList
                  shipSearchList={shipSearchList}
                  listName="ALL"
                  scrollTo={() => scrollTo('ship')}
                  isDraggable
                />
                <ShipList
                  shipSearchList={ownedSearchList}
                  listName="OWNED"
                  scrollTo={() => scrollTo('ship')}
                  isDraggable
                />
              </SideBar>
              <div id="side-scroll" className={`button-group ${config.themeColor}`} style={{ width: 'unset' }}>
                {!isVisible ? (
                  <RButton themeColor={config.themeColor} className="btn slide" onClick={() => scrollTo('top')}>
                    <ArrowDegUp themeColor={config.themeColor} className="icon" />
                  </RButton>
                ) : (
                  <></>
                )}

                <RButton themeColor={config.themeColor} className="btn slide" onClick={() => hideSearchSection(false)}>
                  <CloseIcon themeColor={config.themeColor} className="icon" />
                </RButton>
              </div>
              <div className={`container content ${config.themeColor}`} ref={refData}>
                <ShipDetails
                  topButtonGroup={
                    <>
                      <RButton themeColor={config.themeColor} onClick={addShip} className="btn normal icon-only">
                        <BoxArrowUp themeColor={config.themeColor} className="icon" />
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
