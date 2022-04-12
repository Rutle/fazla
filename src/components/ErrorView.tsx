import React from 'react';
import { useSelector } from 'react-redux';
import { openLogs, closeWindow } from '_/utils/ipcAPI';
import { RootState } from '_/reducers/rootReducer';
import FooterBar from './FooterBar';
import RButton from './RButton/RButton';
import TitleBar from './TitleBar';
import MessageBox from './MessageBox';
/**
 * A view for displaying error messages.
 */
const ErrorView: React.FC<{ isNotFound?: boolean }> = ({ isNotFound = false }) => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  return (
    <>
      <TitleBar showMenu={isNotFound} />
      <div className={`page ${config.themeColor}`}>
        <div id="error" className="container content">
          <MessageBox>{!isNotFound ? appState.eMsg : 'Page not found.'}</MessageBox>
          {/* process.env.PLAT_ENV === 'electron' ? (
            <RButton
              themeColor={config.themeColor}
              onClick={() => {
                // openLogs();
                closeWindow();
              }}
              extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
            >
              Close program
            </RButton>
          ) : (
            <></>
          ) */}
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default ErrorView;
