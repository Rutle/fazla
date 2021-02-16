import React from 'react';
import { useSelector } from 'react-redux';
import { openLogs, closeWindow } from '_/utils/ipcAPI';
import { RootState } from '_/reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
/**
 * A view for displaying error messages.
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
              {process.env.PLAT_ENV === 'electron' ? (
                <RButton
                  themeColor={config.themeColor}
                  onClick={() => {
                    openLogs();
                    closeWindow();
                  }}
                  extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
                >
                  Close program
                </RButton>
              ) : (
                <></>
              )}
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  );
};

export default ErrorView;
