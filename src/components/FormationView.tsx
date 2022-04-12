import React, { CSSProperties, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
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
import { RootState } from '_/reducers/rootReducer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSTransition } from 'react-transition-group';
import { SearchAction, setFleet, updateSearch } from '_/reducers/slices/searchParametersSlice';
import { setIsUpdated } from '_/reducers/slices/appStateSlice';
// eslint-disable-next-line import/no-extraneous-dependencies
import useResizeObserver from 'use-resize-observer';
import { FormationData, getFormationData, parseImportCode } from '_/utils/appUtilities';
import { Formation } from '_/types/types';
import { useParams, useHistory } from 'react-router-dom';
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
import { ArrowDegUp, CloseIcon, PlusIcon, QuestionCircleIcon } from './Icons';
import TooltipWrapper from './Tooltip/TooltipWrapper';
import FormationEquipment from './FormationEquipment';
import MessageBox from './MessageBox';

interface FormationViewState {
  formationData?: FormationData;
  fleetTabIndex: number;
  warning?: string;
  isUpdateRequired: boolean;
  cAction?: 'SUB' | 'EQSTRUCTURE';
  validCode?: boolean;
  importedF?: Formation;
}

type FormationViewAction =
  | {
      type: 'READY';
      data?: FormationData;
      validCode?: boolean;
      importedF?: Formation;
      warning?: string;
      cAction?: 'SUB' | 'EQSTRUCTURE';
    }
  | { type: 'WARNING'; warning: string; validCode?: boolean }
  | { type: 'SELECT'; index: number }
  | { type: 'UPDATE'; isUpdate: boolean };

const initialFormationState: FormationViewState = {
  formationData: undefined,
  fleetTabIndex: 0,
  warning: undefined,
  isUpdateRequired: false,
  cAction: undefined,
  validCode: undefined,
};

const formationReducer = (state: FormationViewState, action: FormationViewAction) => {
  switch (action.type) {
    case 'READY': {
      return {
        ...state,
        warning: action.warning,
        isUpdateRequired: false,
        formationData: action.data,
        cAction: action.cAction,
        validCode: action.validCode,
        importedF: action.importedF,
      };
    }
    case 'WARNING': {
      return {
        ...state,
        fleetTabIndex: 0,
        formationData: undefined,
        warning: action.warning,
        validCode: action.validCode,
      };
    }
    case 'SELECT': {
      return { ...state, fleetTabIndex: action.index };
    }
    case 'UPDATE': {
      return { ...state, isUpdateRequired: action.isUpdate };
    }
    default: {
      return state;
    }
  }
};
ReactModal.setAppElement('#root');
/**
 * View for displaying a formation page.
 */
const FormationView: React.FC<{ viewOnly: boolean }> = ({ viewOnly }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { code } = useParams<{ code: string }>();
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const { shipData, storage, addToast } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const appState = useSelector((state: RootState) => state.appState);
  const [showModal, setModalOpen] = useState({ modal: '', isOpen: false });
  const [showSearch, setShowSearch] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(NaN);
  const refData = useRef<HTMLDivElement>(null);
  const refTransition = useRef<HTMLDivElement>(null);
  const [isVisible, refSide] = useVisibility();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridSize = useResizeObserver<HTMLDivElement>({ ref: gridRef });
  const cHeight = useRef(0);
  const [{ fleetTabIndex, warning, formationData, isUpdateRequired, cAction, validCode, importedF }, dispatchState] =
    useReducer(formationReducer, initialFormationState);
  /*
  useEffect(() => {
    if (gridSize && gridSize.width && gridSize.height && gridSize.height !== cHeight.current)
      cHeight.current = gridSize.height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  useEffect(() => {
    // Parse code from url when used for /link.
    if (viewOnly) {
      const decodedCode = decodeURIComponent(code);
      const parsed = parseImportCode(decodedCode);
      if (parsed) {
        getFormationData(parsed as Formation, shipData)
          .then((res) => {
            if (res.convertAction) {
              dispatchState({
                type: 'READY',
                data: res,
                warning: 'Please convert formation to the new structure.',
                cAction: res.convertAction,
                validCode: true,
              });
            } else {
              dispatchState({ type: 'READY', data: res, validCode: true, importedF: parsed as Formation });
            }
          })
          .catch((e: unknown) => {
            if (e instanceof Error) dispatchState({ type: 'WARNING', warning: e.message });
          });
      } else {
        dispatchState({ type: 'WARNING', warning: 'Invalid import code.', validCode: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, viewOnly]);

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
    dispatch(setFleet({ fleet: 'ALL' }));
  };

  useEffect(() => {
    dispatchState({ type: 'SELECT', index: 0 });
    hideSearchSection(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex]);

  useEffect(() => {
    /* TODO: Check that it scrolls to top when search lit is hidden especially on small screen */
    if (showSearch) scrollTo('reset');
  }, [scrollTo, showSearch]);

  // Update currently selected formation data.
  useEffect(() => {
    // For regular formation view
    if (!viewOnly && fData.formations.length !== 0) {
      getFormationData(fData.formations[fData.selectedIndex], shipData)
        .then((res) => {
          switch (res.convertAction) {
            case 'SUB':
              dispatchState({
                type: 'READY',
                data: undefined,
                warning: 'Please convert formation to the new structure.\nReason: Submarines are missing.',
                cAction: res.convertAction,
              });
              break;
            case 'EQSTRUCTURE':
              dispatchState({
                type: 'READY',
                data: res,
                warning: 'Please convert formation to the new structure.\nReason: Old equipment structure.',
                cAction: res.convertAction,
              });
              break;
            default:
              dispatchState({ type: 'READY', data: res });
              break;
          }
        })
        .catch((e: unknown) => {
          if (e instanceof Error) dispatchState({ type: 'WARNING', warning: e.message });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fData.selectedIndex, fData.formations, viewOnly]);

  // Update search list and show the search section.
  const showSearchSection = useCallback(
    (isOpen: boolean, gridIndex: number) => {
      setSelectedGrid(gridIndex);
      if (!Number.isNaN(gridIndex) && shipData && gridIndex !== undefined && formationData) {
        let fleet: 'ALL' | 'VANGUARD' | 'MAIN' | 'SUBMARINE' = 'ALL';
        if (MAININDEX[formationData.fleetCount].includes(gridIndex)) {
          fleet = 'MAIN';
        } else if (VANGUARDINDEX[formationData.fleetCount].includes(gridIndex)) {
          fleet = 'VANGUARD';
        } else if (SUBMARINE[formationData.fleetCount].includes(gridIndex)) {
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
    [appState.cToggle, dispatch, formationData, shipData]
  );

  const addShip = () => {
    dispatch(formationAction(FormationAction.AddShip, { shipData, gridIndex: selectedGrid }));
    setShowSearch(false);
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

  // Save the data when the formation data is edited.
  useEffect(() => {
    if (fData.isEdit.some((val) => val !== false)) {
      dispatch(formationAction(FormationAction.Save, { storage }));
      if (isUpdateRequired) {
        // After using formation convert we need to remove the warning and update the screen.
        dispatchState({ type: 'READY' });
      }
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
      dispatchState({ type: 'SELECT', index: idx });
      setShowSearch(false);
    },
    []
  );

  const showMessage = () => {
    if (cAction && warning) return warning;
    if (viewOnly && !validCode) return warning;
    return 'No formation data.';
  };

  return (
    <PageTemplate>
      <>
        <ReactModal
          overlayClassName={`modal-overlay ${config.themeColor}`}
          isOpen={showModal.isOpen}
          className="modal-container formation-action rounded"
          onRequestClose={requestClose}
        >
          {renderModal()}
        </ReactModal>
        <div id="formations" className="scroll container content">
          <div id="formation-tab" ref={gridRef}>
            <div className={`f-grid rounded ${config.themeColor}`}>
              <div className="tab" style={{ gap: '5px' }}>
                {viewOnly && validCode && (
                  <RButton
                    themeColor={config.themeColor}
                    className="tab-btn normal"
                    onClick={() => {
                      dispatch(formationAction(FormationAction.Import, { importedFormation: importedF }, addToast));
                      history.push('/formations');
                    }}
                  >
                    <span style={{ display: 'inline-block' }}>
                      Save and Close {`${validCode && cAction ? '(older formation data)' : ''}`}
                    </span>
                  </RButton>
                )}
                {!viewOnly && fData.formations.length !== 0 && (
                  <>
                    <FormationDropDown />
                    <RButton
                      themeColor={config.themeColor}
                      className="tab-btn normal"
                      onClick={() => setModalOpen({ modal: 'new', isOpen: true })}
                    >
                      New
                    </RButton>
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
                      disabled={!!cAction}
                      className="tab-btn normal"
                      onClick={() => setModalOpen({ modal: 'export', isOpen: true })}
                    >
                      Export
                    </RButton>
                    <RButton
                      themeColor={config.themeColor}
                      disabled={!!cAction}
                      className="tab-btn normal"
                      onClick={() => setModalOpen({ modal: 'import', isOpen: true })}
                    >
                      Import
                    </RButton>

                    {cAction && (
                      <RButton
                        themeColor={config.themeColor}
                        className="tab-btn normal selected"
                        onClick={() => {
                          if (cAction) {
                            dispatch(formationAction(FormationAction.Convert, { convertType: cAction }));
                            dispatchState({ type: 'UPDATE', isUpdate: true });
                          }
                        }}
                      >
                        Convert
                      </RButton>
                    )}
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
                )}
              </div>
            </div>
          </div>
          {!viewOnly && cAction === 'EQSTRUCTURE' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontVariantCaps: 'all-petite-caps',
                marginBottom: '10px',
              }}
            >
              Please convert. Reason: Old equipment structure.
            </div>
          )}
          {formationData ? (
            <>
              <div id="fleet-selector" className={`f-grid rounded ${config.themeColor}`}>
                <div className="f-row">
                  <div className="tab fleets" style={{ gap: '5px' }}>
                    {formationData.fleets.map((fleet, idx) => {
                      return (
                        <RButton
                          key={`${'fleet-button'}-${idx * formationData.fleets.length}`}
                          themeColor={config.themeColor}
                          className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
                          onClick={setTabIndex(idx)}
                          disabled={fData.formations.length === 0}
                        >
                          {idx + 1 === formationData.fleets.length ? 'Submarines' : `Fleet ${idx + 1}`}
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
                ships={formationData.fleets}
                openSearchSection={showSearchSection}
                selectedGridIndex={selectedGrid}
                fleetCount={formationData.fleetCount}
                // refd={gridRef}
                viewOnly={viewOnly}
              />
              <FormationEquipment
                selectedFleetIndex={fleetTabIndex}
                data={formationData.fleets}
                equipmentData={formationData.equipment}
                isOldFormation={!!cAction}
                viewOnly={viewOnly}
              />

              <div className="scroll" style={{ minHeight: '300px' }}>
                {formationData.fleets.map((fleet, idx) => {
                  return (
                    <div
                      id="passive-section"
                      key={`tab${idx * formationData.fleets.length}`}
                      className={`${fleetTabIndex !== idx ? 'hidden' : ''}`}
                    >
                      <FormationPassives
                        key={`${'passive'}-${idx * formationData.fleets.length}`}
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
            <MessageBox>{showMessage()}</MessageBox>
          )}
        </div>
        {!viewOnly && (
          <CSSTransition nodeRef={refTransition} in={showSearch} timeout={300} classNames="search-section">
            <div
              id="formation-ship-search"
              ref={refTransition}
              className={`${formationData && formationData.fleetCount === 2 ? 'normal-fleet' : 'siren-fleet'} ${
                config.themeColor
              }`}
              style={
                cHeight.current
                  ? {
                      top: `${cHeight.current + 166}px`,
                      minHeight: `calc(100% - ${cHeight.current + 194}px)`,
                      height: `calc(100% - ${cHeight.current + 194}px)`,
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
              <div id="ship-details-content" ref={refData}>
                <ShipDetails
                  topButtonGroup={
                    <>
                      <RButton themeColor={config.themeColor} onClick={addShip} className="btn normal icon">
                        <div className="btn-icon">
                          <PlusIcon themeColor={config.themeColor} />
                        </div>
                        Fleet
                      </RButton>
                    </>
                  }
                />
              </div>
            </div>
          </CSSTransition>
        )}
      </>
    </PageTemplate>
  );
};

export default FormationView;
