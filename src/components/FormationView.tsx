import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import FormationEquipment from './FormationEquipment';

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
  const cHeight = useRef(0);

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
    // setSelectedGrid(NaN);
    dispatch(setFleet({ fleet: 'ALL' }));
  };

  useEffect(() => {
    setFleetTabIndex(0);
    hideSearchSection(false);
    // setSelectedGrid(NaN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex]);

  useEffect(() => {
    /* TODO: Check that it scrolls to top when search lit is hidden especially on small screen */
    if (showSearch) scrollTo('reset');
  }, [scrollTo, showSearch]);

  // Update currently selected formation data.
  useEffect(() => {
    if (fData.formations.length !== 0) {
      // setFormationData([]);
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
  const showSearchSection = useCallback(
    (isOpen: boolean, gridIndex: number) => {
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
    },
    [appState.cToggle, dispatch, fleetCount, shipData]
  );

  const addShip = () => {
    dispatch(formationAction(FormationAction.AddShip, { shipData, gridIndex: selectedGrid }));
    setShowSearch(false);
    // setSelectedGrid(NaN);
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
    if (gridSize && gridSize.width && gridSize.height && gridSize.height !== cHeight.current)
      cHeight.current = gridSize.height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Use width to prevent re-renders when drag and dropping items.
    if (gridSize && gridSize.width && gridSize.height && gridSize.height !== cHeight.current)
      cHeight.current = gridSize.height;
    if (gridSize && gridSize.height && gridSize.height !== cHeight.current) cHeight.current = gridSize.height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize.width, gridSize.height]);

  const getSlideStyle = (): CSSProperties => {
    if (isVisible) {
      if (gridSize.width && gridSize.width <= 546) {
        return { right: '10px', top: '200px', display: 'inline-flex', position: 'fixed', padding: '12px' };
      }
      return {
        display: 'inline-flex',
        top: '0px',
        right: '0px',
        position: 'absolute',
        padding: '12px',
      };
    }
    return {};
  };
  const setTabIndex = useCallback(
    (idx: number) => () => {
      setFleetTabIndex(idx);
    },
    []
  );
  return (
    <PageTemplate>
      <>
        <section className="page-content formations">
          <ReactModal
            overlayClassName={`modal-overlay ${config.themeColor}`}
            isOpen={showModal.isOpen}
            className="modal-container formation-action rounded"
            onRequestClose={requestClose}
          >
            {renderModal()}
          </ReactModal>
          <div id="formation-content" className="container content">
            <div className={`f-grid rounded ${config.themeColor}`}>
              <div className="tab" style={{ gap: '5px' }}>
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
                      extraProps={{
                        style: { maxWidth: '20px', padding: '2px', display: 'flex', alignItems: 'center' },
                      }}
                    >
                      <QuestionCircleIcon themeColor={config.themeColor} />
                    </TooltipWrapper>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {formationData.length !== 0 && fData.formations.length !== 0 ? (
              <>
                <div id="fleet-selector" className={`f-grid rounded ${config.themeColor}`}>
                  <div className="f-row">
                    <div className="tab fleets" style={{ gap: '5px' }}>
                      {formationData.map((fleet, idx) => {
                        return (
                          <RButton
                            key={`${'fleet-button'}-${idx * formationData.length}`}
                            themeColor={config.themeColor}
                            className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
                            /*
                            onClick={() => {
                              setFleetTabIndex(idx);
                            }} */
                            onClick={setTabIndex(idx)}
                            disabled={fData.formations.length === 0}
                          >
                            {idx + 1 === formationData.length && isSubFleet ? 'Submarines' : `Fleet ${idx + 1}`}
                          </RButton>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <FormationGrid
                  fleetName={fData.formations[fData.selectedIndex].name}
                  themeColor={config.themeColor}
                  selectedFleetIndex={fleetTabIndex}
                  ships={formationData}
                  openSearchSection={showSearchSection}
                  selectedGridIndex={selectedGrid}
                  fleetCount={fleetCount}
                  isSubFleet={isSubFleet}
                  refd={gridRef}
                />
                <FormationEquipment selectedFleetIndex={fleetTabIndex} data={formationData} />

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
                  <span className="message" style={{ fontSize: '24px', justifyContent: 'center', width: '100%' }}>
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
                cHeight.current
                  ? {
                      top: `${cHeight.current + 184}px`,
                      minHeight: `calc(100% - ${cHeight.current + 212}px)`,
                      height: `calc(100% - ${cHeight.current + 212}px)`,
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
              <div id="small-nav" className={`navigation ${config.themeColor}`} style={getSlideStyle()}>
                {!isVisible ? (
                  <RButton
                    themeColor={config.themeColor}
                    className="nav-item"
                    onClick={() => scrollTo('top')}
                    extraStyle={{ display: 'flex', padding: '6px', marginTop: '4px', borderRadius: 'inherit' }}
                  >
                    <ArrowDegUp themeColor={config.themeColor} className="icon" />
                  </RButton>
                ) : (
                  <></>
                )}
                <RButton
                  themeColor={config.themeColor}
                  className="nav-item"
                  onClick={() => hideSearchSection(false)}
                  extraStyle={{ display: 'flex', padding: '6px', marginTop: '4px', borderRadius: 'inherit' }}
                >
                  <CloseIcon themeColor={config.themeColor} className="icon" />
                </RButton>
              </div>
              <div className={`container content ${config.themeColor}`} ref={refData}>
                <ShipDetails
                  topButtonGroup={
                    <>
                      <RButton
                        themeColor={config.themeColor}
                        onClick={addShip}
                        className="btn normal icon-only"
                        extraStyle={{ display: 'flex', padding: '4px' }}
                      >
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
