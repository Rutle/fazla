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
      <div id="footer-state-msg" style={process.env.PLAT_ENV === 'web' ? { justifyContent: 'flex-end' } : {}}>
        {process.env.PLAT_ENV === 'electron' ? <span>{`${appState.cMsg}`}</span> : <span>Code by Rutle</span>}
      </div>
    </div>
  );
};

export default FooterBar;
