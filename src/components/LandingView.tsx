import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
    if (appState.cState === 'RUNNING') history.push('/shipdetails');
    if (appState.cState === 'ERROR') history.push('/error');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cState]);

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
              {appState.cState !== 'RUNNING' ? appState.cMsg : 'Launching.'}
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default LandingView;
