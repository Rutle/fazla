import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '_/reducers/rootReducer';
import FooterBar from './FooterBar';
import TitleBar from './TitleBar';

/**
 * Landing page for application that is presented during loading settings.
 */
const LandingView: React.FC = () => {
  const history = useHistory();
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  useEffect(() => {
    const rr = sessionStorage.getItem('rr') as string;
    if (appState.cState === 'RUNNING' && appState.isData /* && rr !== null */) {
      // sessionStorage.removeItem('rr');
      // history.push(rr);
    }
    if (appState.cState === 'RUNNING' && appState.isData && rr === null) {
      // localStorage.removeItem('rr');
      // Used when coming directly to the '/' path. '/' is not inside RefreshRoute so rr is null.
      history.push('/ships');
    }
    if (appState.cState === 'ERROR') history.push('/error');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cState]);

  return (
    <>
      <TitleBar showMenu={false} />
      <div className={`page ${config.themeColor}`}>
        <div className={`container content ${config.themeColor}`} style={{ justifyContent: 'center', height: '100%' }}>
          <div
            style={{
              height: '200px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {appState.cState !== 'RUNNING' ? appState.cMsg : 'Launching.'}
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
