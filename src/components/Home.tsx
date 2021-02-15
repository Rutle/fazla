import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import { updateShipData } from '_/reducers/slices/appStateSlice';
import { RootState } from '_/reducers/rootReducer';
import { configAction, AppConfigAction } from '_/reducers/slices/programConfigSlice';
import { AppContext } from '_/App';
import PageTemplate from './PageTemplate';
import RButton from './RButton/RButton';
import RToggle from './RToggle/RToggle';
import RSwitch from './RSwitch/RSwitch';
/**
 * Options page.
 */
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { addToast, shipData, storage } = useContext(AppContext);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const [shipCount, setShipCount] = useState(appState.shipCount);
  const [docksCount, setDocksCount] = useState(ownedList.length);
  /*
  const [srcInputLen, setSRCInputLen] = useState(config.jsonURL.length || 25);
  const [jsonSRCValue, setJSONSRCValue] = useState(config.jsonURL);
  const [isSRCFocus, setSRCFocus] = useState(false);
  */
  const [shipDiff, setShipDiff] = useState({ count: 0, isUpdate: false });
  /*
  useEffect(() => {
    setSRCFocus(false);
    setSRCInputLen(25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  useEffect(() => {
    setDocksCount(ownedList.length);
  }, [ownedList]);

  useEffect(() => {
    setShipCount(appState.shipCount);
  }, [appState.shipCount]);

  const updateConfig = useCallback(
    (key: string, value: string | boolean) => {
      dispatch(configAction(AppConfigAction.Update, { key, value }));
    },
    [dispatch]
  );
  const renderUpdate = () => {
    let text = 'Update';
    let disabled = false;
    if (appState.cState !== 'RUNNING' && appState.cState !== 'INIT') {
      text = 'Please wait';
      disabled = true;
    }
    return (
      <RButton
        themeColor={`${config.themeColor}`}
        onClick={() => {
          setShipDiff({ count: shipData.count, isUpdate: true });
          if (config.isToast) addToast('info', 'Update', 'Updating ship information.');
          dispatch(updateShipData(shipData, storage, addToast));
        }}
        disabled={disabled}
      >
        {text}
      </RButton>
    );
  };

  const renderSave = () => {
    return (
      <RButton
        themeColor={`${config.themeColor}`}
        onClick={() => dispatch(configAction(AppConfigAction.Save, {}))}
        disabled={!config.isEdit}
      >
        Save changes
      </RButton>
    );
  };
  /*
  const setSRCInputFocus = (e: React.FocusEvent<HTMLInputElement>, len: number) => {
    setSRCInputLen(len);
    setSRCFocus(!isSRCFocus);
  };
  */
  const getShipCount = () => {
    if (shipDiff.isUpdate && appState.cState === 'RUNNING') {
      const diff = shipData.count - shipDiff.count;
      return (
        <>
          {shipCount} (
          <span style={{ color: diff >= 0 ? 'LimeGreen' : 'firebrick' }}>{`${diff >= 0 ? '+' : ''}${diff}`}</span>)
        </>
      );
    }
    if (appState.cState === 'INIT') return '\u221E';
    if (appState.cState === 'UPDATING' || appState.cState === 'SAVING') return shipCount;
    if (!shipDiff.isUpdate && appState.cState === 'RUNNING') return shipCount;
    return shipCount;
  };
  return (
    <PageTemplate>
      <section className="page-content">
        <div className="home-container">
          <div className={`f-grid ${config.themeColor}`}>
            <div className="f-row">
              <div className="f-icon bottom-emp">{/* <FontAwesomeIcon icon={faCaretRight} /> */}</div>
              <div className="f-title bottom-emp">Options</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update ship data</div>
              <div className="grid-item action">{renderUpdate()}</div>
            </div>
            {process.env.PLAT_ENV === 'electron' ? (
              <>
                {/* 
                <div className="f-row wrap">
                  <div className="grid-item name">Raw data URL</div>
                  <div className="grid-item action">
                    <input
                      type="url"
                      placeholder={config.jsonURL ? config.jsonURL : ''}
                      spellCheck="false"
                      className={`url-input ${config.themeColor}`}
                      style={{ width: `${srcInputLen}ch` }}
                      value={jsonSRCValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setJSONSRCValue(e.target.value);
                      }}
                      onFocus={(e) => {
                        setSRCInputFocus(e, config.jsonURL.length);
                        e.target.select();
                      }}
                      onBlur={(e) => {
                        setSRCInputFocus(e, 25);
                        if (e.target.value !== config.jsonURL) {
                          dispatch(configAction(AppConfigAction.Update, 'jsonURL', jsonSRCValue));
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="f-row wrap">
                  {}
                  <div className="grid-item name">Formation tooltips</div>
                  <div className="grid-item action">
                    <RSwitch
                      id="form-tooltip"
                      themeColor={config.themeColor}
                      onChange={() => updateConfig('formHelpTooltip', !config.formHelpTooltip)}
                      checked={config.formHelpTooltip}
                    />
                  </div>
                </div>
                <div className="f-row wrap">
                  <div className="grid-item name">Toasts</div>
                  <div className="grid-item action">
                    <RSwitch
                      id="toasts"
                      themeColor={config.themeColor}
                      onChange={() => updateConfig('isToast', !config.isToast)}
                      checked={config.isToast}
                    />
                  </div>
                </div> */}
              </>
            ) : (
              <></>
            )}
            <div className="f-row wrap">
              <div className="grid-item name">Theme color</div>
              <div className="grid-item action">
                <div className={`radio-group ${config.themeColor}`}>
                  <RToggle
                    id="dark"
                    value="dark"
                    themeColor={config.themeColor}
                    onChange={() => updateConfig('themeColor', 'dark')}
                    selected={config.themeColor === 'dark'}
                  >
                    Dark
                  </RToggle>
                  <RToggle
                    id="light"
                    value="light"
                    themeColor={config.themeColor}
                    onChange={() => updateConfig('themeColor', 'light')}
                    selected={config.themeColor === 'light'}
                  >
                    Light
                  </RToggle>
                </div>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship data update date</div>
              <div className="grid-item action">{config.updateDate !== '' ? config.updateDate : 'N/A'}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name" style={{ opacity: `${config.isEdit ? '1' : '0.2'}` }} />
              <div className="grid-item action">{renderSave()}</div>
            </div>
            <div className="f-row">
              <div className="f-icon bottom-emp">{/* <FontAwesomeIcon icon={faCaretRight} /> */}</div>
              <div className="f-title bottom-emp">Stats</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship count</div>
              <div className="grid-item action">{getShipCount()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Docks count</div>
              <div className="grid-item action">{appState.cState === 'INIT' ? '-' : docksCount}</div>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default Home;
