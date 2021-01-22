import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
import { initShipLists, setCurrentState, setErrorMessage } from '../reducers/slices/appStateSlice';
import { checkResource, downloadShipData, initData } from '../utils/appUtilities';
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
  const [shipResource, setShipResource] = useState('');
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
          return checkResource();
        })()
          .then(async (result) => {
            setShipResource(result.msg);
            if (result.isOk && result.msg === 'resNotFound') {
              return;
            }
            const dataObj = await initData();
            if (dataObj.isOk && dataObj.msg === 'resNotFoundInit') {
              setShipResource(dataObj.msg);
              return;
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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      if (appState.cState === 'INIT' && downloadState.isDataOk && downloadState.isReady) {
        (async () => {
          const dataObj = await initData();
          if (dataObj.isOk && dataObj.msg === 'resNotFound') setShipResource(dataObj.msg);
          await shipData.setArray(dataObj.shipData);
          dispatch(initShipLists(dataObj.ownedShips, shipData, dataObj.config, dataObj.formations));
        })().catch((error: Error) => {
          dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
          history.push('/error');
        });
      }
    } catch (e) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Initialization failed.', eState: 'ERROR' }));
    }
  }, [appState.cState, dispatch, downloadState, history, shipData]);

  const getInitMsg = () => {
    // {appState.cState === 'RUNNING' ? 'Initialization ready.' : 'Initializing.'}
    if (appState.cState === 'INIT') {
      if (shipResource === 'resNotFound') return 'Initialization waiting ship data.';
      return 'Initializing.';
    }
    if (appState.cState === 'RUNNING') {
      return 'Initialization ready.';
    }
    return 'Waiting for initialization';
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
              {shipResource === 'resNotFound' ? (
                <>
                  <div
                    className={`message-container ${config.themeColor}`}
                    style={{
                      height: '48px',
                      width: '300px',
                    }}
                  >
                    <span className="message">
                      {downloadState.isReady && downloadState.isDataOk
                        ? 'Ship data is ready.'
                        : 'Ship data needs to be downloaded'}
                    </span>
                    <RButton
                      themeColor={config.themeColor}
                      className={`btn normal ${downloadState.isReady && downloadState.isDataOk ? '' : 'selected'}`}
                      disabled={downloadState.isDl || (downloadState.isReady && downloadState.isDataOk)}
                      onClick={async () => {
                        setDownloadState({ ...downloadState, isDl: true, text: 'Downloading' });
                        dispatch(setCurrentState({ cState: 'DOWNLOADING', cMsg: 'Downloading data' }));
                        const res = await downloadShipData();
                        if (!res.isOk) {
                          setDownloadState({ isReady: true, isDl: false, isDataOk: false, text: 'Failed' });
                        }
                        setDownloadState({ isReady: true, isDl: false, isDataOk: true, text: 'Done' });
                        dispatch(setCurrentState({ cState: 'INIT', cMsg: 'Initializing.' }));
                      }}
                      extraStyle={{
                        height: 'inherit',
                        width: '105px',
                      }}
                    >
                      {downloadState.text}
                    </RButton>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div
                className={`message-container ${config.themeColor}`}
                style={{
                  height: '30px',
                  width: '300px',
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
              <RButton
                disabled={!(appState.cState === 'RUNNING')}
                themeColor={config.themeColor}
                onClick={() => {
                  history.push('/shipdetails');
                }}
                extraStyle={{
                  marginTop: '5px',
                  height: '30px',
                  width: '200px',
                }}
              >
                Continue
              </RButton>
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
