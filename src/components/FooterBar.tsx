import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
/**
 * Footer component.
 */
const FooterBar: React.FC = () => {
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  const getDate = (ms: number): string => {
    if (Number.isNaN(ms)) return '-';
    return new Date(ms).toUTCString();
  };
  const getVersion = (version: number): string => {
    if (Number.isNaN(version)) return '-';
    return `v${version}`;
  };

  return (
    <div id="footer" className={`${config.themeColor}`}>
      <div className="footer-msg-container">
        <div id="footer-version-msg">
          Ship data: {getVersion(appState.versions.ships['version-number'])} |{' '}
          {getDate(appState.versions.ships['last-data-refresh-date'])}
        </div>
        <div id="footer-state-msg" style={process.env.PLAT_ENV === 'web' ? { justifyContent: 'flex-end' } : {}}>
          {process.env.PLAT_ENV === 'electron' ? <span>{`${appState.cMsg}`}</span> : <span>Code by Rutle</span>}
        </div>
      </div>
    </div>
  );
};

export default FooterBar;
