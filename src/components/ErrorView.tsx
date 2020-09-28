import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import FooterBar from './FooterBar';
import TitleBar from './TitleBar';

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
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default ErrorView;
