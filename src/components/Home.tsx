import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { updateShipData, initShipLists, setCurrentPage } from '../reducers/slices/appStateSlice';
import { initData } from '../util/appUtilities';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { configAction, AppConfigAction } from '../reducers/slices/programConfigSlice';
import RButton from './RButton.tsx/RButton';

interface HomeProps {
  shipData: DataStore;
}

const Home: React.FC<HomeProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const [shipCount, setShipCount] = useState(shipData.count);
  const [docksCount, setDocksCount] = useState(0);
  const [srcInputLen, setSRCInputLen] = useState(config.jsonURL.length | 25);
  const [jsonSRCValue, setJSONSRCValue] = useState<string | undefined>('');
  const [isSRCFocus, setSRCFocus] = useState<boolean>(false);

  useEffect(() => {
    if (appState.cPage !== 'HOME') {
      dispatch(setCurrentPage({ cPage: 'HOME' }));
      setSRCFocus(false);
      setSRCInputLen(25);
    }
    console.log('[Home] [] appState :[', appState.cState, '] cPage: [', appState.cPage, ']');
    try {
      if (shipData.init === 'INIT') {
        console.log('[INIT] {1}: Async anonymous function call to init data.');
        (async () => {
          const initDataObj = await initData();
          await shipData.setArray(initDataObj.shipData);
          setShipCount(shipData.shipsArr.length);
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
          setJSONSRCValue(initDataObj.config.jsonURL);
        })();
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDocksCount(ownedList.length);
  }, [ownedList]);

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
        onClick={() => dispatch(updateShipData(shipData))}
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
        onClick={() => dispatch(configAction(AppConfigAction.Save))}
        disabled={!config.isEdit}
      >
        Save
      </RButton>
    );
  };

  const setSRCInputFocus = (e: React.FocusEvent<HTMLInputElement>, len: number) => {
    setSRCInputLen(len);
    setSRCFocus(!isSRCFocus);
  };

  return (
    <PageTemplate>
      <section className="page-content">
        <div className="home-container dark">
          <div className="f-grid dark">
            <div className="f-row">
              <div className="f-icon bottom-emp">
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
              <div className="f-title bottom-emp">Options</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">{renderUpdate()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Raw data URL:</div>
              <div className="grid-item action">
                <input
                  type="url"
                  placeholder={config.jsonURL !== '' ? config.jsonURL : ''}
                  spellCheck="false"
                  className={`text-input ${config.themeColor}`}
                  style={{ width: `${srcInputLen}ch` }}
                  value={jsonSRCValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setJSONSRCValue(e.target.value);
                  }}
                  onFocus={(e) => setSRCInputFocus(e, config.jsonURL.length)}
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
              <div className="grid-item name">Formation tooltips</div>
              <div className="grid-item action">
                <form action="#" style={{ display: 'flex' }}>
                  <div className="switch">
                    <input
                      id="form-tooltip"
                      type="checkbox"
                      className="switch-input"
                      checked={config.formHelpTooltip}
                      onChange={() => {
                        dispatch(configAction(AppConfigAction.Update, 'formHelpTooltip', !config.formHelpTooltip));
                      }}
                    />
                    <label htmlFor="form-tooltip" className="switch-label">
                      Switch
                    </label>
                  </div>
                </form>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name" style={{ opacity: `${config.isEdit ? '1' : '0.2'}` }}>
                Save changes
              </div>
              <div className="grid-item action">{renderSave()}</div>
            </div>
            <div className="f-row">
              <div className="f-icon bottom-emp">
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
              <div className="f-title bottom-emp">Stats</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship count</div>
              <div className="grid-item action">{appState.cState === 'INIT' ? '-' : shipCount}</div>
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

Home.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
