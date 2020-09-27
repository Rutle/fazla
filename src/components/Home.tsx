import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { updateShipData } from '../reducers/slices/appStateSlice';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { configAction, AppConfigAction } from '../reducers/slices/programConfigSlice';
import RButton from './RButton/RButton';

interface HomeProps {
  shipData: DataStore;
}

const Home: React.FC<HomeProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const ownedList = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const [shipCount, setShipCount] = useState(appState.shipCount);
  const [docksCount, setDocksCount] = useState(ownedList.length);
  const [srcInputLen, setSRCInputLen] = useState(config.jsonURL.length | 25);
  const [jsonSRCValue, setJSONSRCValue] = useState(config.jsonURL);
  const [isSRCFocus, setSRCFocus] = useState(false);
  const [shipDiff, setShipDiff] = useState({ count: 0, isUpdate: false });

  useEffect(() => {
    setSRCFocus(false);
    setSRCInputLen(25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDocksCount(ownedList.length);
  }, [ownedList]);

  useEffect(() => {
    setShipCount(appState.shipCount);
  }, [appState.shipCount]);

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
          dispatch(updateShipData(shipData));
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

  const getShipCount = () => {
    if (shipDiff.isUpdate && appState.cState === 'RUNNING') {
      const diff = shipDiff.count - shipData.count;
      return (
        <>
          {shipCount} (<span style={{ color: diff >= 0 ? 'LimeGreen' : 'firebrick' }}>{`${diff}`}</span>)
        </>
      );
    }
    if (appState.cState === 'INIT') return '\u221E';
    if (appState.cState === 'UPDATING' || appState.cState === 'SAVING') return shipCount;
    if (!shipDiff.isUpdate && appState.cState === 'RUNNING') return shipCount;
  };
  return (
    <PageTemplate>
      <section className="page-content">
        <div className="home-container">
          <div className={`f-grid ${config.themeColor}`}>
            <div className="f-row">
              <div className="f-icon bottom-emp">
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
              <div className="f-title bottom-emp">Options</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update ship data</div>
              <div className="grid-item action">{renderUpdate()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Raw data URL</div>
              <div className="grid-item action">
                <input
                  type="url"
                  placeholder={config.jsonURL ? config.jsonURL : ''}
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
              <div className="grid-item name">Theme color</div>
              <div className="grid-item action">
                <div className={`radio-group ${config.themeColor}`}>
                  <input
                    id="dark-input"
                    type="radio"
                    checked={config.themeColor === 'dark'}
                    onChange={() => dispatch(configAction(AppConfigAction.Update, 'themeColor', 'dark'))}
                  />
                  <label
                    className={`btn graphic ${config.themeColor}${config.themeColor === 'dark' ? ' selected' : ''}`}
                    htmlFor="dark-input"
                  >
                    Dark
                  </label>
                  <input
                    id="light-input"
                    type="radio"
                    checked={config.themeColor === 'light'}
                    onChange={() => dispatch(configAction(AppConfigAction.Update, 'themeColor', 'light'))}
                  />
                  <label
                    className={`btn graphic ${config.themeColor}${config.themeColor === 'light' ? ' selected' : ''}`}
                    htmlFor="light-input"
                  >
                    Light
                  </label>
                </div>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship data update date</div>
              <div className="grid-item action">{config.updateDate !== '' ? config.updateDate : 'N/A'}</div>
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

Home.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
