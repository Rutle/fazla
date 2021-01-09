import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { openLogs } from '../utils/appUtilities';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
/**
 * Error page.
 */
const ErrorView: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);
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
              <div className="info-text">{appState.eMsg}</div>
              <RButton
                themeColor={config.themeColor}
                onClick={openLogs}
                extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
              >
                Open logs
              </RButton>
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default ErrorView;
