import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BasicResponse } from '_/utils/types';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
import { initShipLists, setErrorMessage, addPhaseState } from '../reducers/slices/appStateSlice';
import { downloadShipData, initData } from '../utils/appUtilities';
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
          // let initDataObj = await initData();
          dispatch(addPhaseState('Loading ship data from disk...'));
          return initData();
          /*
          if (!initDataObj.isOk) {
            console.log(initDataObj.msg);
            if (initDataObj.msg === 'accessFail') {
              response = await downloadShipData();
            } else {
              throw new Error('There was a problem with initializing the program.');
            }
          }
          // Set current data array to shipData.
          await shipData.setArray(initDataObj.shipData);
          dispatch(addPhaseState('Initialization of data structure... done.'));
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
          dispatch(addPhaseState('Initialization of program state... done.'));
          */
        })()
          .then(async (result) => {
            let response: BasicResponse = { isOk: false, msg: '' };
            if (!result.isOk) {
              if (result.msg === 'accessFail') {
                dispatch(addPhaseState('Downloading ship data...'));
                response = await downloadShipData();
              } else {
                throw new Error('There was a problem with initializing the program.');
              }
              if (!response.isOk) {
                throw new Error(response.msg);
              }
              dispatch(addPhaseState('Initializing new ship data...'));
              return initData();
            }
            return result;
          })
          .then(async (result) => {
            await shipData.setArray(result.shipData);
            dispatch(addPhaseState('Initialization of data structure...'));
            dispatch(initShipLists(result.ownedShips, shipData, result.config, result.formations));
            dispatch(addPhaseState('Initialization of program state...'));
          })
          .catch((error: Error) => {
            dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message, eState: 'ERROR' }));
            history.push('/error');
          });
      }
    } catch (error) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Initialization failed.', eState: 'ERROR' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <div>
                <ul
                  style={{
                    listStyle: 'none',
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
                        fontSize: '14px',
                      }}
                    >
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <RButton
                disabled={!(appState.cState === 'RUNNING')}
                themeColor={config.themeColor}
                onClick={() => {
                  history.push('/shipdetails');
                }}
                extraStyle={{ marginTop: '30px', height: '50px', width: '300px' }}
              >
                Program is ready. Please continue.
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
