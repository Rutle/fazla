import React, { ReactNode, useCallback, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faWindowMinimize, faWindowMaximize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
// import { FaTimes, FaWindowMinimize, FaWindowMaximize, FaWindowRestore } from 'react-icons/fa';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } from '_/utils/ipcAPI';
import { RootState } from '_/reducers/rootReducer';
import { configAction, AppConfigAction } from '_/reducers/slices/programConfigSlice';
import { AppContext } from '_/App';
import CloseAppModalContent from './Modal/CloseAppModalContent';
import RButton from './RButton/RButton';
import RToggle from './RToggle/RToggle';

const NavItem: React.FC<{ children: ReactNode; pathTo: string }> = ({ children, pathTo }) => {
  const [isFocusOutline, setFocusOutline] = useState(false);

  return (
    <NavLink
      className={`${!isFocusOutline ? 'no-focus-outline' : ''}`}
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

NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  pathTo: PropTypes.string.isRequired,
};

ReactModal.setAppElement('#root');
/**
 * Component for titlebar.
 */
const TitleBar: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const dispatch = useDispatch();
  const { storage } = useContext(AppContext);
  const formGrid = useSelector((state: RootState) => state.formationGrid);
  const config = useSelector((state: RootState) => state.config);
  const [isMax, setIsMax] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const updateConfig = useCallback(
    (key: string, value: string | boolean) => {
      dispatch(configAction(AppConfigAction.Update, { key, value, storage, doSave: true }));
    },
    [dispatch, storage]
  );
  const isEdit = () => {
    return config.isEdit || formGrid.isEdit.some((val) => val !== false);
  };

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
            <nav className={`tab ${config.themeColor}`} aria-label="primary">
              <NavItem pathTo="/shipdetails">
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
              {/* <FaWindowMinimize /> */}
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
                {/* <FaWindowRestore /> */}
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
                {/* <FaWindowMaximize /> */}
              </RButton>
            )}
            <RButton
              className="title-button"
              id="close-button"
              onClick={() => {
                if (isEdit()) {
                  setModalOpen(!isModalOpen);
                } else {
                  closeWindow();
                }
              }}
            >
              {/* <FaTimes /> */}
            </RButton>
          </div>
        ) : (
          <div id="window-controls" className="web">
            <div className={`radio-group ${config.themeColor}`}>
              <RToggle
                id="dark-toggle"
                value="dark"
                className="btn normal"
                themeColor={config.themeColor}
                onChange={() => updateConfig('themeColor', 'dark')}
                selected={config.themeColor === 'dark'}
              >
                D
              </RToggle>
              <RToggle
                id="light-toggle"
                value="light"
                className="btn normal"
                themeColor={config.themeColor}
                onChange={() => {
                  updateConfig('themeColor', 'light');
                  console.log(process.env.PUBLIC_URL);
                }}
                selected={config.themeColor === 'light'}
              >
                L
              </RToggle>
            </div>
          </div>
        )}
      </div>
      <ReactModal
        overlayClassName={`modal-overlay ${config.themeColor}`}
        isOpen={isModalOpen}
        className="modal-container"
        shouldCloseOnEsc
        onRequestClose={() => setModalOpen(false)}
      >
        <CloseAppModalContent setModalOpen={setModalOpen} />
      </ReactModal>
    </header>
  );
};

export default TitleBar;

TitleBar.propTypes = {
  showMenu: PropTypes.bool.isRequired,
};
