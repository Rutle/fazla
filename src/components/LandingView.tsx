/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
import { useHistory } from 'react-router';
import { initShipLists, setErrorMessage, addPhaseState } from '../reducers/slices/appStateSlice';
import { initData } from '../util/appUtilities';
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

  useEffect(() => {
    try {
      if (appState.cState === 'INIT') {
        (async () => {
          // Load data from .json using electron.
          const initDataObj = await initData();
          dispatch(addPhaseState('Loading ship data from disk... done.'));
          if (!initDataObj.isOk) {
            throw new Error('There was a problem with initializing the program.');
          }

          // Set current data array to shipData.
          await shipData.setArray(initDataObj.shipData);
          dispatch(addPhaseState('Initialization of data structure... done.'));
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
          dispatch(addPhaseState('Initialization of program state... done.'));
        })().catch((error: Error) => {
          dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
          history.push('/error');
        });
      }
    } catch (error) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderList = () => {
    return (
      <ul
        style={{
          listStyle: 'none',
          alignSelf: 'flex-end',
          paddingInlineStart: '6px',
          marginBlockEnd: '6px',
        }}
      >
        {appState.initPhases.map((value) => (
          <li
            key={`${value}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span style={{ marginRight: '15px' }}>{value}</span>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <>
      <TitleBar showMenu={false} />
      <div className={`page ${config.themeColor}`}>
        <section className="page-content">
          <div className="ship-data-container dark">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {appState.cState === 'RUNNING' ? (
                <>
                  <div className="info-text">Program is ready. Please continue.</div>
                  <RButton
                    themeColor={config.themeColor}
                    onClick={() => {
                      history.push('/shipdetails');
                    }}
                    extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
                  >
                    Continue
                  </RButton>
                </>
              ) : (
                <>{renderList()}</>
              )}
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
