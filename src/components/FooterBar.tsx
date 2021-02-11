import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
/**
 * Footer component.
 */
const FooterBar: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  return (
    <div id="footer" className={`${config.themeColor}`}>
      <div id="footer-state-msg">
        <span>{`${appState.cMsg}`}</span>
      </div>
    </div>
  );
};

export default FooterBar;
