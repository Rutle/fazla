import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '_/App';
import { RootState } from '_/reducers/rootReducer';
import { useParams, useHistory } from 'react-router-dom';
import { FormationData, getFormationData, parseImportCode } from '_/utils/appUtilities';
import { Formation } from '_/types/types';
import { FormationAction, formationAction } from '_/reducers/slices/formationGridSlice';
import { clearErrorMessage, setErrorMessage } from '_/reducers/slices/appStateSlice';
import PageTemplate from './PageTemplate';
import FormationGrid from './FormationGrid';
import FormationPassives from './FormationPassives';
import RButton from './RButton/RButton';

/**
 * View for displaying a formation page.
 */
const FormationLinkView: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { code } = useParams<{ code: string }>();
  const { shipData, storage, addToast } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const fData = useSelector((state: RootState) => state.formationGrid);
  const appState = useSelector((state: RootState) => state.appState);
  const [fleetTabIndex, setFleetTabIndex] = useState<number>();
  const gridRef = useRef<HTMLDivElement>(null);
  const [validCode, setValidCode] = useState<boolean | undefined>(undefined);
  const [importedF, setImportedF] = useState<Formation | undefined>(undefined);
  const [importData, setImportData] = useState<FormationData>();

  // Parse given code.
  useEffect(() => {
    const decodedCode = decodeURIComponent(code);
    const parsed = parseImportCode(decodedCode);
    if (parsed) {
      setValidCode(true);
      setImportedF(parsed as Formation);
    } else {
      setValidCode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Update currently selected formation data.
  useEffect(() => {
    if (importedF && validCode) {
      getFormationData(importedF, shipData)
        .then((res) => {
          setImportData(res);
          setFleetTabIndex(0);
        })
        .catch((e) => {
          if (e instanceof Error) dispatch(setErrorMessage({ cState: 'RUNNING', eMsg: e.message, eState: 'WARNING' }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedF]);

  // Save data when formation data is edited.
  useEffect(() => {
    dispatch(formationAction(FormationAction.Save, { storage }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fData.isEdit]);

  useEffect(() => {
    if (appState.cState === 'RUNNING' && appState.eState === 'WARNING') {
      dispatch(clearErrorMessage());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Add the new layout from formation view.
  return (
    <PageTemplate>
      <>
        <section className="page-content formations">
          <div id="formation-content" className="container content">
            {validCode !== undefined && typeof fleetTabIndex !== 'undefined' ? (
              <>
                {validCode &&
                importedF &&
                importData &&
                appState.eState !== 'WARNING' &&
                appState.cState === 'RUNNING' ? (
                  <>
                    <div className="tab">
                      <RButton
                        themeColor={config.themeColor}
                        className="tab-btn normal"
                        onClick={() => {
                          dispatch(formationAction(FormationAction.Import, { importedFormation: importedF }, addToast));
                          /*
                          history.push({
                            pathname: '/formations',
                            state: { newImportedFleet: true },
                          });
                          */
                        }}
                      >
                        <span style={{ display: 'inline-block' }}>Add to your formations</span>
                      </RButton>
                    </div>
                    <FormationGrid
                      fleetName={importedF.name}
                      themeColor={config.themeColor}
                      selectedFleetIndex={fleetTabIndex}
                      ships={importData.fleets}
                      fleetCount={importData.fleetCount}
                      refd={gridRef}
                      isExportedLink
                    />
                    <div id="fleet-selector" className="tab">
                      {importData.fleets.map((fleet, idx) => {
                        return (
                          <RButton
                            key={`${'fleet-button'}-${idx * importData.fleets.length}`}
                            themeColor={config.themeColor}
                            className={`tab-btn normal${fleetTabIndex === idx ? ' selected' : ''}`}
                            onClick={() => {
                              setFleetTabIndex(idx);
                            }}
                          >
                            {idx + 1 === importData.fleets.length ? 'Submarines' : `Fleet ${idx + 1}`}
                          </RButton>
                        );
                      })}
                    </div>
                    <div className="scroll">
                      {importData.fleets.map((fleet, idx) => {
                        return (
                          <div
                            id="passive-section"
                            key={`tab${idx * importData.fleets.length}`}
                            className={`${fleetTabIndex !== idx ? 'hidden' : ''}`}
                          >
                            <FormationPassives
                              key={`${'passive'}-${idx * importData.fleets.length}`}
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
                          <>Invalid formation code/link.</>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </section>
      </>
    </PageTemplate>
  );
};

export default FormationLinkView;
