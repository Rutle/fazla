import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { useSelector } from 'react-redux';

const FooterBar: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  return (
    <div id="footer" className={`${config.themeColor}`}>
      <div id="footer-state-msg">
        <span>{appState.cMsg}</span>
        <span className="footer-error">{appState.eFlag ? appState.eMsg : ''}</span>
      </div>
    </div>
  );
};

export default FooterBar;
