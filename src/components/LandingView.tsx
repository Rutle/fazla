import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
import { initShipLists, setCurrentState, setErrorMessage } from '../reducers/slices/appStateSlice';
import { checkResource, closeWindow, downloadShipData, initData } from '../utils/appUtilities';
import { AppContext } from '../App';
/**
 * Landing page for application that is presented during loading settings.
 */
const LandingView: React.FC = () => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const history = useHistory();
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);
  const [shipResource, setShipResource] = useState({
    code: '',
    msg: '',
  });
  const [downloadState, setDownloadState] = useState({
    isDl: false,
    isReady: false,
    isDataOk: false,
    text: 'Download',
  });

  useEffect(() => {
    try {
      if (appState.cState === 'INIT') {
        (async () => {
          return checkResource(); // Check that .json data exists.
        })()
          .then(async (result) => {
            setShipResource({ code: result.code as string, msg: result.msg });
            if (result.isOk && result.code === 'ResNotFound') {
              return;
            }
            const dataObj = await initData();
            if (dataObj.code === 'ResNotFound' || dataObj.code === 'JSONParseFail') {
              setShipResource({ code: dataObj.code, msg: dataObj.msg });
              return;
            }
            if (dataObj.code === 'InitError') {
              throw new Error(dataObj.msg);
            }
            await shipData.setArray(dataObj.shipData);
            dispatch(initShipLists(dataObj.ownedShips, shipData, dataObj.config, dataObj.formations));
          })
          .catch((error: Error) => {
            dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
            history.push('/error');
          });
      }
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Initialization failed.', eState: 'ERROR' }));
      history.push('/error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (appState.cState === 'INIT' && downloadState.isDataOk && downloadState.isReady) {
        (async () => {
          const dataObj = await initData();
          if (dataObj.code === 'ResNotFound' || dataObj.code === 'JSONParseFail') {
            setShipResource({ code: dataObj.code, msg: dataObj.msg });
            setDownloadState({ isReady: false, isDl: false, isDataOk: false, text: 'Download' });
            return;
          }
          if (dataObj.code === 'InitError') {
            setDownloadState({ isReady: false, isDl: false, isDataOk: false, text: 'Download' });
            throw new Error(dataObj.msg);
          }
          await shipData.setArray(dataObj.shipData);
          dispatch(initShipLists(dataObj.ownedShips, shipData, dataObj.config, dataObj.formations));
        })().catch((error: Error) => {
          dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
          history.push('/error');
        });
      }
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Initialization failed.', eState: 'ERROR' }));
      history.push('/error');
    }
  }, [appState.cState, dispatch, downloadState, history, shipData]);

  const getInitMsg = () => {
    if (appState.cState === 'INIT') {
      if (shipResource.code === 'ResNotFound') return 'Initialization waiting ship data.';
      if (shipResource.code === 'JSONParseFail') return shipResource.msg;
      return 'Initializing.';
    }
    if (appState.cState === 'RUNNING') {
      return 'Initialization is ready.';
    }
    if (appState.cState === 'DOWNLOADING') {
      return 'Waiting for download to finish.';
    }
    return 'Waiting for initialization';
  };

  const getMessage = () => {
    if (shipResource.code === 'ResNotFound') {
      if (downloadState.isReady && downloadState.isDataOk) return 'Ship data is ready.';
      return 'Ship data needs to be downloaded';
    }
    if (shipResource.code === 'JSONParseFail') {
      return 'Try downloading data again.';
    }
    return '';
  };

  return (
    <>
      <TitleBar showMenu={false} />
      <div className={`page ${config.themeColor}`}>
        <section className="page-content">
          <div className={`ship-data-container ${config.themeColor}`}>
            <div
              style={{
                height: '50%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {shipResource.code === 'ResNotFound' || shipResource.code === 'JSONParseFail' ? (
                <div
                  className={`message-container ${config.themeColor}`}
                  style={{
                    minWidth: '50%',
                  }}
                >
                  <span className="message">{getMessage()}</span>
                  <RButton
                    themeColor={config.themeColor}
                    className={`btn normal ${downloadState.isReady && downloadState.isDataOk ? '' : 'selected'}`}
                    disabled={downloadState.isDl || (downloadState.isReady && downloadState.isDataOk)}
                    onClick={async () => {
                      setDownloadState({ ...downloadState, isDl: true, text: 'Downloading' });
                      dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading' }));
                      const res = await downloadShipData();
                      if (!res.isOk) {
                        setDownloadState({ isReady: true, isDl: false, isDataOk: false, text: 'Download failed.' });
                        dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
                      } else {
                        setDownloadState({ isReady: true, isDl: false, isDataOk: true, text: 'Download finished.' });
                        dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
                      }
                    }}
                    extraStyle={{
                      height: 'inherit',
                      border: `1px solid var(--main-${config.themeColor}-bg)`,
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                    }}
                  >
                    {downloadState.text}
                  </RButton>
                </div>
              ) : (
                <></>
              )}
              <div
                className={`message-container ${config.themeColor}`}
                style={{
                  minWidth: '50%',
                }}
              >
                <span className="message">{getInitMsg()}</span>
              </div>
            </div>
            <div
              style={{
                height: '50%',
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <div className={`button-group ${config.themeColor}`} style={{ minWidth: '50%', width: 'unset' }}>
                <RButton
                  disabled={appState.cState !== 'RUNNING'}
                  themeColor={config.themeColor}
                  onClick={() => {
                    history.push('/shipdetails');
                  }}
                >
                  Continue
                </RButton>
                <RButton
                  disabled={appState.cState !== 'RUNNING'}
                  themeColor={config.themeColor}
                  onClick={() => {
                    closeWindow();
                  }}
                >
                  Exit
                </RButton>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
