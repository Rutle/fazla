import React, { ReactNode, useCallback, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } from '_/utils/ipcAPI';
import { RootState } from '_/reducers/rootReducer';
import { configAction, AppConfigAction } from '_/reducers/slices/programConfigSlice';
import { AppContext } from '_/App';
import { MinIcon, MaxIcon, RestoreIcon, CloseIcon } from './Icons';
import RButton from './RButton/RButton';

const NavItem: React.FC<{ children: ReactNode; pathTo: string; classNames?: string }> = ({
  children,
  pathTo,
  classNames = 'nav-item',
}) => {
  const [isFocusOutline, setFocusOutline] = useState(false);

  return (
    <NavLink
      className={`${classNames} ${!isFocusOutline ? 'no-focus-outline' : ''}`}
      to={pathTo}
      onKeyUp={(e) => {
        if (e.key === 'Tab') {
          setFocusOutline(true);
        }
      }}
      onMouseDown={() => {
        if (isFocusOutline) setFocusOutline(false);
      }}
      onClick={(e) => {
        const { clientX, clientY } = e;
        if (clientX !== 0 && clientY !== 0) {
          setFocusOutline(false);
        } else {
          setFocusOutline(true);
        }
      }}
    >
      {children}
    </NavLink>
  );
};

/**
 * Component for titlebar.
 */
const TitleBar: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const dispatch = useDispatch();
  const { storage } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const [isMax, setIsMax] = useState(false);
  const updateConfig = useCallback(
    (key: string, value: string | boolean) => {
      dispatch(configAction(AppConfigAction.Update, { key, value, storage, doSave: true }));
    },
    [dispatch, storage]
  );

  const getStyle = () => {
    if (config.themeColor === 'light') {
      return {};
    }
    return {
      borderBottom: `1px solid var(--main-${config.themeColor}-border)`,
      boxShadow: 'inset 0px -4px 3px -4px #00000099',
    };
  };

  return (
    <header id="titlebar" className={`${config.themeColor}`}>
      <div id="drag-region">
        <div id="window-title">
          <span>Formation tool</span>
        </div>
        {showMenu ? (
          <div id="window-menu">
            <nav className={`tab navigation ${config.themeColor}`} aria-label="primary">
              <NavItem pathTo="/ships">
                <span>Ships</span>
              </NavItem>
              <NavItem pathTo="/formations">
                <span>Formations</span>
              </NavItem>
              {process.env.PLAT_ENV === 'electron' ? (
                <NavItem pathTo="/options">
                  <span>Options</span>
                </NavItem>
              ) : (
                <></>
              )}
            </nav>
          </div>
        ) : (
          <>
            <div style={getStyle()} />
          </>
        )}
        <div id="window-filler" />
        {process.env.PLAT_ENV === 'electron' ? (
          <div id="window-controls" className="electron">
            <RButton className="title-button" id="min-button" onClick={() => minimizeWindow()}>
              <MinIcon themeColor={config.themeColor} />
            </RButton>
            {isMax ? (
              <RButton
                className="title-button"
                id="restore-button"
                onClick={() => {
                  restoreWindow();
                  setIsMax(false);
                }}
              >
                <RestoreIcon themeColor={config.themeColor} />
              </RButton>
            ) : (
              <RButton
                className="title-button"
                id="max-button"
                onClick={() => {
                  maximizeWindow();
                  setIsMax(true);
                }}
              >
                <MaxIcon themeColor={config.themeColor} />
              </RButton>
            )}
            <RButton
              className="title-button"
              id="close-button"
              onClick={() => {
                closeWindow();
              }}
            >
              <CloseIcon themeColor={config.themeColor} />
            </RButton>
          </div>
        ) : (
          <div id="window-controls" className="web">
            <div id="theme-controls" className={`navigation ${config.themeColor}`}>
              <RButton
                className={`nav-item ${config.themeColor === 'dark' ? 'selected' : ''}`}
                themeColor={config.themeColor}
                onClick={() => updateConfig('themeColor', 'dark')}
                extraStyle={{ backgroundColor: 'inherit' }}
              >
                D
              </RButton>
              <RButton
                className={`nav-item ${config.themeColor === 'light' ? 'selected' : ''}`}
                themeColor={config.themeColor}
                onClick={() => updateConfig('themeColor', 'light')}
                extraStyle={{ backgroundColor: 'inherit' }}
              >
                L
              </RButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TitleBar;
