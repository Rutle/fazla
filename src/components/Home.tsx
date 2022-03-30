import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateShipData } from '_/reducers/slices/appStateSlice';
import { RootState } from '_/reducers/rootReducer';
import { configAction, AppConfigAction } from '_/reducers/slices/programConfigSlice';
import { AppContext } from '_/App';
import PageTemplate from './PageTemplate';
import RButton from './RButton/RButton';
import RToggle from './RToggle/RToggle';
/**
 * Options page.
 */
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { addToast, shipData } = useContext(AppContext);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const [shipCount, setShipCount] = useState(appState.shipCount);
  const [docksCount, setDocksCount] = useState(ownedList.length);
  const [shipDiff, setShipDiff] = useState({ count: 0, isUpdate: false });

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
      <div className={`button-group rounded ${config.themeColor}`}>
        <RButton
          themeColor={`${config.themeColor}`}
          onClick={() => {
            setShipDiff({ count: shipData.getShips().length, isUpdate: true });
            if (config.isToast) addToast('info', 'Update', 'Updating ship information.');
            dispatch(updateShipData(shipData, addToast)); // Only used in Electron
          }}
          disabled={disabled}
        >
          {text}
        </RButton>
      </div>
    );
  };
  const getShipCount = () => {
    if (shipDiff.isUpdate && appState.cState === 'RUNNING') {
      const diff = shipData.getShips().length - shipDiff.count;
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
      <div className="container content" style={{ height: '100%' }}>
        <div className={`f-grid rounded ${config.themeColor}`}>
          <div className="f-row">
            <div className="f-header">Options</div>
          </div>
          <div className="f-column f-body widen">
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
                <div className={`radio-group rounded ${config.themeColor}`}>
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
              <div className="grid-item name">Last update on</div>
              <div className="grid-item name" style={{ maxWidth: 'unset' }}>
                {config.updateDate !== '' ? config.updateDate : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        <div className={`f-grid rounded ${config.themeColor}`}>
          <div className="f-row">
            <div className="f-header">Stats</div>
          </div>
          <div className="f-column f-body widen">
            <div className="f-row wrap">
              <div className="grid-item name">Ship count</div>
              <div className="grid-item action">{getShipCount()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ships in docks</div>
              <div className="grid-item action">{appState.cState === 'INIT' ? '-' : docksCount}</div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Home;
